'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAdminAttempts, AdminAttemptListItem } from '@/features/admin/api/adminApi';

export default function AdminAttemptsPage() {
  const t = useTranslations('admin');
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading, isError, refetch } = useAdminAttempts({
    page,
    limit: 10,
    status: status || undefined,
  });

  const columns: ColumnDef<AdminAttemptListItem>[] = [
    {
      id: 'id',
      header: 'Attempt ID',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
          {item.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (item) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.user?.name}</p>
          <p className="text-[11px] text-neutral-500">{item.user?.email}</p>
        </div>
      ),
    },
    {
      id: 'product',
      header: 'Benchmark',
      cell: (item) => (
        <span className="text-xs">
          {typeof item.product?.name === 'object'
            ? item.product.name[locale] || item.product.name.en
            : item.product?.name || item.product?.slug}
        </span>
      ),
    },
    {
      id: 'language',
      header: 'Language',
      cell: (item) => <span className="text-xs uppercase">{item.language}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      id: 'dates',
      header: 'Timeline',
      cell: (item) => (
        <div className="text-[11px] text-neutral-500">
          <p>Started: {new Date(item.startedAt).toLocaleDateString()}</p>
          {item.submittedAt && <p>Submitted: {new Date(item.submittedAt).toLocaleDateString()}</p>}
        </div>
      ),
    },
    {
      id: 'score',
      header: 'Score',
      cell: (item) => {
        if (!item.scoreSummary) return <span className="text-neutral-400">—</span>;
        const total = item.scoreSummary.totalScore ?? item.scoreSummary.overallScore;
        return (
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {total !== undefined ? `${total} pts` : 'Calculated'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => (
        <Link href={`/${locale}/admin/attempts/${item.id}`}>
          <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            Inspect
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Attempts"
        description="Review candidate diagnostic responses, score summaries, and timestamps."
      />

      <FilterBar
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status,
            options: [
              { label: 'All Statuses', value: '' },
              { label: 'Submitted', value: 'SUBMITTED' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Expired', value: 'EXPIRED' },
            ],
          },
        ]}
        onFilterChange={(_, val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={() => {
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
    </div>
  );
}

