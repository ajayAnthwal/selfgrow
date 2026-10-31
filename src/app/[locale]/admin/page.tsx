'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  FileCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { StatCard } from '@/features/admin/components/StatCard';
import {
  DateRangePicker,
  DateRangeValue,
  computePresetRange,
} from '@/features/admin/components/DateRangePicker';
import { useAdminDashboard } from '@/features/admin/api/adminApi';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { formatMoney } from '@/lib/utils/formatMoney';

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard');
  const locale = useLocale();

  const [dateRange, setDateRange] = useState<DateRangeValue>(() => ({
    ...computePresetRange('30d'),
    preset: '30d',
  }));

  const { data, isLoading, isError, refetch } = useAdminDashboard({
    from: dateRange.from,
    to: dateRange.to,
  });

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    failedOrders: 0,
    freeReports: 0,
    paidReports: 0,
    newUsers: 0,
    pendingReviewReports: 0,
    failedReports: 0,
  };

  const revenueTrend = (data?.revenueTrend || []).map((item) => ({
    ...item,
    formattedRevenue: item.amount / 100,
  }));

  const userTrend = data?.userTrend || [];

  const revenueByProduct = (data?.revenueByProduct || []).map((item) => ({
    ...item,
    formattedRevenue: item.revenue / 100,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        }
      />

      <div className="text-right text-xs text-neutral-400">
        <span>{t('autoRefresh')}</span>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <p className="font-medium">Failed to load analytics data.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 text-xs font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t('revenue')}
              value={formatMoney(metrics.totalRevenue, { locale })}
              subtitle={`${metrics.paidOrders} paid orders`}
              icon={<IndianRupee className="h-5 w-5 text-emerald-600" />}
            />
            <StatCard
              title={t('orders')}
              value={metrics.totalOrders}
              subtitle={`${metrics.paidOrders} paid · ${metrics.failedOrders} failed`}
              icon={<ShoppingCart className="h-5 w-5 text-blue-600" />}
            />
            <StatCard
              title={t('newUsers')}
              value={metrics.newUsers}
              subtitle="Registered candidates"
              icon={<Users className="h-5 w-5 text-indigo-600" />}
            />
            <StatCard
              title={t('pendingReview')}
              value={metrics.pendingReviewReports}
              subtitle="Awaiting admin release"
              icon={<Clock className="h-5 w-5 text-amber-600" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title={t('paidVsFailed')}
              value={`${metrics.paidOrders} / ${metrics.failedOrders}`}
              subtitle="Order settlement health"
              icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
            />
            <StatCard
              title={t('freeVsPaid')}
              value={`${metrics.freeReports} free / ${metrics.paidReports} paid`}
              subtitle="Generated reports breakdown"
              icon={<FileCheck className="h-5 w-5 text-teal-600" />}
            />
            <StatCard
              title={t('failedReports')}
              value={metrics.failedReports}
              subtitle="Requires AI retry / inspection"
              icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Trend Chart */}
            <Card className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {t('revenueTrend')}
              </h3>
              <div className="h-64 w-full">
                {revenueTrend.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                    No revenue recorded for selected period.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrend}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip
                        formatter={(val: any) => [`₹${val}`, 'Revenue']}
                        labelStyle={{ fontSize: 12 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="formattedRevenue"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#revenueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* User Registration Trend */}
            <Card className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {t('usersTrend')}
              </h3>
              <div className="h-64 w-full">
                {userTrend.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                    No users registered in selected period.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        formatter={(val: any) => [val, 'New Users']}
                        labelStyle={{ fontSize: 12 }}
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>

          {/* Revenue by Product Chart */}
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {t('productRevenue')}
            </h3>
            <div className="h-64 w-full">
              {revenueByProduct.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                  No product sales in selected period.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByProduct} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" tickFormatter={(val) => `₹${val}`} tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="title"
                      type="category"
                      width={160}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₹${val}`, 'Revenue']}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="formattedRevenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

