'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useReports, useDownloadReport } from '@/features/reports/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { FileText, Download, Eye, ExternalLink } from 'lucide-react';

export default function AccountReportsPage() {
  const t = useTranslations('reports');
  const locale = useLocale();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data, isLoading } = useReports({ page, limit: 10 });
  const downloadReportMutation = useDownloadReport();

  const handleDownload = async (reportId: string) => {
    setDownloadingId(reportId);
    try {
      const res = await downloadReportMutation.mutateAsync(reportId);
      if (res?.downloadUrl) {
        window.open(res.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      toast('Failed to generate download link. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 border-slate-200 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </Card>
    );
  }

  const reports = data?.items || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 10 };

  if (reports.length === 0) {
    return (
      <Card className="p-10 border-slate-200">
        <EmptyState
          icon={<FileText className="w-8 h-8 text-slate-400" />}
          title={t('noReports')}
          description="Completed assessments and diagnostic evaluation reports will appear here."
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
                <th className="px-6 py-4">Evaluation Report</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => {
                const dateStr = new Date(report.createdAt).toLocaleDateString(
                  locale === 'hi' ? 'hi-IN' : 'en-IN',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                );

                const isReleased = report.status === 'RELEASED';
                const isDownloading = downloadingId === report.id;

                const displayName =
                  typeof report.productName === 'object'
                    ? report.productName[locale] || report.productName.en
                    : report.productName || 'Assessment Report';

                return (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {displayName}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-medium text-slate-600">
                      {report.language}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={report.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-600">{dateStr}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/reports/status/${report.orderId}`}
                        className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-800 p-1"
                        title="View Status"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Status</span>
                      </Link>

                      {isReleased && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report.id)}
                          isLoading={isDownloading}
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                        >
                          PDF
                        </Button>
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

