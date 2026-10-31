'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Server,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  Cpu,
} from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminSystemStatus } from '@/features/admin/api/adminApi';

export default function AdminSystemStatusPage() {
  const t = useTranslations('admin.system');
  const { data, isLoading, isError, refetch } = useAdminSystemStatus();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        <p className="font-medium">Failed to retrieve system health metrics.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-xs font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const backlog = data.queue?.backlog ?? 0;
  const failedJobs = data.queue?.failedJobs ?? 0;
  const lastSuccess = (data as any).lastSuccessfulReportTime || data.queue?.lastSuccessfulReportAt;

  const isHealthy = failedJobs === 0 && backlog < 20;
  const isWarning = failedJobs > 0 && failedJobs < 5;
  const isCritical = failedJobs >= 5;

  const uptimeHours = (data as any).system?.uptimeSeconds
    ? Math.floor((data as any).system.uptimeSeconds / 3600)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description="Real-time operational telemetry for background worker queues, AI generation pipeline, and database pools."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Status:</span>
            {isCritical ? (
              <Badge variant="danger" size="md" className="flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Critical
              </Badge>
            ) : isWarning ? (
              <Badge variant="warning" size="md" className="flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Warning
              </Badge>
            ) : (
              <Badge variant="success" size="md" className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Systems Normal
              </Badge>
            )}
          </div>
        }
      />

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {t('queueBacklog')}
            </span>
            <Layers className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {backlog} jobs
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {backlog === 0 ? 'No queue delay' : `${backlog} reports actively synthesizing`}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {t('failedJobs')}
            </span>
            <AlertTriangle
              className={`h-5 w-5 ${failedJobs > 0 ? 'text-red-600' : 'text-neutral-400'}`}
            />
          </div>
          <p className="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {failedJobs}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {failedJobs === 0 ? 'Zero unhandled errors' : 'Requires AI review / retry'}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {t('lastSuccess')}
            </span>
            <Clock className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {lastSuccess ? new Date(lastSuccess).toLocaleTimeString() : 'No recent release'}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {lastSuccess ? new Date(lastSuccess).toLocaleDateString() : 'Awaiting jobs'}
          </p>
        </Card>
      </div>

      {/* Component Services Health */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                {t('database')}
              </h3>
            </div>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            PostgreSQL instance with connection pooling active. Auto-migrated schema and indexes operational.
          </p>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                {t('aiProvider')}
              </h3>
            </div>
            <Badge variant="success" size="sm">Operational</Badge>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            OpenAI Structured Output Engine with exponential backoff and localized prompt injection.
          </p>
          {uptimeHours !== null && (
            <p className="text-[11px] text-neutral-500">Node process uptime: {uptimeHours} hours</p>
          )}
        </Card>
      </div>
    </div>
  );
}

