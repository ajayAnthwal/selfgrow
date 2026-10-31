'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useOrders } from '@/features/orders/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { formatMoney } from '@/lib/utils/formatMoney';
import { ShoppingBag, ArrowRight, Eye, FileText } from 'lucide-react';

export default function AccountOrdersPage() {
  const t = useTranslations('orders');
  const locale = useLocale();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useOrders({ page, limit: 10 });

  if (isLoading) {
    return (
      <Card className="p-6 border-slate-200 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </Card>
    );
  }

  const orders = data?.items || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 10 };

  if (orders.length === 0) {
    return (
      <Card className="p-10 border-slate-200">
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8 text-slate-400" />}
          title={t('noOrders')}
          description="Your assessment purchase history will appear here once you place an order."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">{t('orderId')}</th>
                <th className="px-6 py-4">{t('orderDate')}</th>
                <th className="px-6 py-4">{t('amount')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString(
                  locale === 'hi' ? 'hi-IN' : 'en-IN',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                );

                return (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-slate-600">{dateStr}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatMoney(order.amountInPaise, {
                        locale,
                        currency: order.currency,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-800 p-1"
                        title={t('viewOrder')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{t('viewOrder')}</span>
                      </Link>

                      {order.status === 'PAID' && (
                        <Link
                          href={`/reports/status/${order.id}`}
                          className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-800 p-1"
                          title={t('viewReport')}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          <span>{t('viewReport')}</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

