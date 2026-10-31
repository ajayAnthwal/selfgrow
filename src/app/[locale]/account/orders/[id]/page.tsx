'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useOrder } from '@/features/orders/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatMoney } from '@/lib/utils/formatMoney';
import {
  ArrowLeft,
  FileText,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = String(params?.id || '');
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card className="p-8 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  if (isError || !order) {
    notFound();
  }

  const dateStr = new Date(order.createdAt).toLocaleDateString(
    locale === 'hi' ? 'hi-IN' : 'en-IN',
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const isPaid = order.status === 'PAID';

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>{tCommon('back')}</span>
        </Link>
      </div>

      <Card className="p-8 border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              {t('orderId')}
            </div>
            <h2 className="text-lg font-mono font-bold text-slate-900">{order.id}</h2>
          </div>
          <div>
            <StatusBadge status={order.status} size="lg" />
          </div>
        </div>

        {/* Product & Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-xs text-slate-500 font-medium">Evaluation Product</div>
            <div className="font-bold text-slate-900">
              {typeof order.product?.name === 'object'
                ? order.product.name[locale] || order.product.name.en
                : order.product?.name || 'Diagnostic Assessment'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-xs text-slate-500 font-medium">{t('amount')}</div>
            <div className="text-xl font-extrabold text-brand-700">
              {formatMoney(order.amountInPaise, {
                locale,
                currency: order.currency,
              })}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Created on: {dateStr}</span>
          </div>
          {order.paidAt && (
            <div className="flex items-center space-x-2 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Paid on: {new Date(order.paidAt).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN')}</span>
            </div>
          )}
        </div>

        {/* Payment Receipt / Gateway Details */}
        {order.payments && order.payments.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>{t('paymentReceipt')}</span>
            </h3>

            <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-100">
              {order.payments.map((p) => (
                <div key={p.id} className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-semibold text-slate-800">{p.razorpayPaymentId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to view report */}
        {isPaid && (
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <Link href={`/reports/status/${order.id}`}>
              <Button variant="primary" size="md" leftIcon={<FileText className="w-4 h-4" />}>
                <span>{t('viewReport')}</span>
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

