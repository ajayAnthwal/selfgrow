'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  useAdminOrders,
  useAdminOrder,
  AdminOrderListItem,
} from '@/features/admin/api/adminApi';
import { formatMoney } from '@/lib/utils/formatMoney';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminOrdersPage() {
  const t = useTranslations('admin');
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminOrders({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status: status || undefined,
  });

  const { data: orderDetail, isLoading: isLoadingDetail } = useAdminOrder(
    selectedOrderId || ''
  );

  const handleExportCsv = () => {
    const q = new URLSearchParams();
    if (search.trim()) q.set('search', search.trim());
    if (status) q.set('status', status);
    const exportUrl = `/api/v1/admin/orders/export?${q.toString()}`;
    window.open(exportUrl, '_blank');
  };

  const columns: ColumnDef<AdminOrderListItem>[] = [
    {
      id: 'id',
      header: 'Order ID',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
          {item.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: (item) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {item.user?.name || 'Unknown'}
          </p>
          <p className="text-[11px] text-neutral-500">{item.user?.email}</p>
        </div>
      ),
    },
    {
      id: 'product',
      header: 'Product',
      cell: (item) => (
        <span className="text-xs">
          {typeof item.product?.name === 'object'
            ? item.product.name[locale] || item.product.name.en
            : item.product?.name || item.product?.slug}
        </span>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: (item) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {formatMoney(item.amountInPaise, { locale })}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      id: 'createdAt',
      header: 'Date',
      cell: (item) => (
        <span className="text-xs text-neutral-500">
          {new Date(item.createdAt).toLocaleDateString(
            locale === 'hi' ? 'hi-IN' : 'en-US',
            { dateStyle: 'medium' }
          )}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setSelectedOrderId(item.id)}
          className="h-7 px-2 text-xs"
        >
          <Eye className="mr-1 h-3 w-3" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders & Payments"
        description="Monitor candidate purchases, verify Razorpay transactions, and inspect audit logs."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            {t('table.exportCsv')}
          </Button>
        }
      />

      <FilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search by customer email or Razorpay ID..."
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            options: [
              { label: 'All Statuses', value: '' },
              { label: 'Paid', value: 'PAID' },
              { label: 'Created', value: 'CREATED' },
              { label: 'Failed', value: 'FAILED' },
              { label: 'Refunded', value: 'REFUNDED' },
            ],
          },
        ]}
        onFilterChange={(_, val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={() => {
          setSearch('');
          setStatus('');
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

      {/* Order Detail Modal */}
      <Modal
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
        title="Order & Payment Details"
        size="lg"
      >
        {isLoadingDetail || !orderDetail ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/50">
              <div>
                <p className="text-xs text-neutral-500">Order ID</p>
                <p className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {orderDetail.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Razorpay Order ID</p>
                <p className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {orderDetail.razorpayOrderId || 'Free Product Flow'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Customer</p>
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  {orderDetail.user?.name} ({orderDetail.user?.email})
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Order Status</p>
                <div className="mt-1">
                  <StatusBadge status={orderDetail.status} />
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Amount</p>
                <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {formatMoney(orderDetail.amountInPaise, { locale })}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Linked Attempt</p>
                <Link
                  href={`/${locale}/admin/attempts/${orderDetail.attemptId}`}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  View Attempt Responses →
                </Link>
              </div>
            </div>

            {/* Payment Transactions */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Payment Transactions
              </h4>
              {!orderDetail.payments || orderDetail.payments.length === 0 ? (
                <p className="text-xs text-neutral-400">No payment transaction records.</p>
              ) : (
                <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  {orderDetail.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 text-xs">
                      <div>
                        <p className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                          {p.razorpayPaymentId}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Method: {p.method || 'Online'} · {new Date(p.createdAt).toLocaleString()}
                        </p>
                        {p.failureReason && (
                          <p className="text-[11px] text-red-500">Reason: {p.failureReason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatMoney(p.amountInPaise, { locale })}
                        </p>
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linked Report */}
            {orderDetail.report && (
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
                <div>
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Diagnostic AI Report
                  </p>
                  <p className="text-[11px] text-neutral-500">Status: {orderDetail.report.status}</p>
                </div>
                <Link href={`/${locale}/admin/reports/${orderDetail.report.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    Inspect Report
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

