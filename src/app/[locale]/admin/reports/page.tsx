'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, FileCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAdminReports, AdminReportListItem } from '@/features/admin/api/adminApi';
import { cn } from '@/lib/utils/cn';

export default function AdminReportsListPage() {
  const t = useTranslations('admin.reports');
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<
    'ALL' | 'PENDING_REVIEW' | 'FAILED' | 'GENERATED' | 'RELEASED'
  >('ALL');

  const { data, isLoading, isError, refetch } = useAdminReports({
    page,
    limit: 10,
    status: currentTab,
  });

  // Query counts for tabs
  const { data: pendingData } = useAdminReports({ page: 1, limit: 1, status: 'PENDING_REVIEW' });
  const { data: failedData } = useAdminReports({ page: 1, limit: 1, status: 'FAILED' });

  const tabs = [
    { id: 'ALL', label: t('tabs.all') },
    {
      id: 'PENDING_REVIEW',
      label: t('tabs.pendingReview'),
      badge: pendingData?.total ?? 0,
      badgeVariant: 'warning',
    },
    {
      id: 'FAILED',
      label: t('tabs.failed'),
      badge: failedData?.total ?? 0,
      badgeVariant: 'danger',
    },
    { id: 'GENERATED', label: t('tabs.generated') },
    { id: 'RELEASED', label: t('tabs.released') },
  ];

  const columns: ColumnDef<AdminReportListItem>[] = [
    {
      id: 'id',
      header: 'Report ID',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
          {item.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      id: 'candidate',
      header: 'Candidate & Order',
      cell: (item) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {item.order?.user?.name || 'Candidate'}
          </p>
          <p className="text-[11px] text-neutral-500">{item.order?.user?.email}</p>
        </div>
      ),
    },
    {
      id: 'product',
      header: 'Benchmark',
      cell: (item) => (
        <span className="text-xs">
          {typeof item.order?.product?.name === 'object'
            ? item.order.product.name[locale] || item.order.product.name.en
            : item.order?.product?.name || 'Evaluation Report'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      id: 'version',
      header: 'Revision',
      cell: (item) => <span className="font-mono text-xs">v{item.version}</span>,
    },
    {
      id: 'createdAt',
      header: 'Date',
      cell: (item) => (
        <span className="text-xs text-neutral-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => (
        <Link href={`/${locale}/admin/reports/${item.id}`}>
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            Review & Edit
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description="Inspect AI-generated clinical reports, verify findings, perform manual revisions, and release final PDF deliverables."
      />

      {/* Status Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex space-x-1 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCurrentTab(tab.id as any);
                  setPage(1);
                }}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                    : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-300'
                )}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.2 text-[10px] font-bold',
                      tab.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : tab.badgeVariant === 'danger'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

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
    </div>
  );
}

