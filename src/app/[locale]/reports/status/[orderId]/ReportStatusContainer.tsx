'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useOrder } from '@/features/orders/api';
import { useReports, useReport, useDownloadReport } from '@/features/reports/api';
import { ReportStatusTracker } from '@/features/reports/components/ReportStatusTracker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  Mail,
  LifeBuoy,
  Sparkles,
  Loader2,
  FileText,
} from 'lucide-react';
import { ReportStatus } from '@/features/reports/types';

interface ReportStatusContainerProps {
  orderId: string;
}

export function ReportStatusContainer({ orderId }: ReportStatusContainerProps) {
  const t = useTranslations('reports');
  const tCommon = useTranslations('common');
  const { toast } = useToast();

  const [startTime] = useState<number>(() => Date.now());
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  // Monitor document visibility to pause polling when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Compute polling interval with exponential backoff & hard stop after 10 mins
  const calculatePollingInterval = (status?: string | null): number | false => {
    if (!isTabVisible) return false;

    // Terminal states stop polling
    if (status === 'RELEASED' || status === 'FAILED' || status === 'REJECTED') {
      return false;
    }

    const elapsedMs = Date.now() - startTime;
    // Hard stop after 10 minutes (600,000ms)
    if (elapsedMs > 600 * 1000) {
      return false;
    }

    // Start with 3s for first 30 seconds, then backoff to 10s
    return elapsedMs < 30 * 1000 ? 3000 : 10000;
  };

  // 1. Fetch Order
  const {
    data: order,
    isLoading: isOrderLoading,
    refetch: refetchOrder,
  } = useOrder(orderId, {
    refetchInterval: (query: any) => calculatePollingInterval(query.state.data?.status),
  });

  // 2. Fetch User Reports to locate the report for this orderId
  const {
    data: reportsData,
    refetch: refetchReports,
  } = useReports();

  const matchedReportSummary = reportsData?.items?.find((r) => r.orderId === orderId);

  // 3. Fetch detailed report if found
  const {
    data: detailedReport,
    refetch: refetchDetailedReport,
  } = useReport(matchedReportSummary?.id || '', {
    enabled: Boolean(matchedReportSummary?.id),
    refetchInterval: (query: any) => calculatePollingInterval(query.state.data?.status),
  });

  const downloadReportMutation = useDownloadReport();

  const report = detailedReport || matchedReportSummary;
  const isTerminal =
    report?.status === 'RELEASED' ||
    report?.status === 'FAILED' ||
    report?.status === 'REJECTED';

  const hasExceededTenMinutes = Date.now() - startTime > 600 * 1000;

  // Handle PDF Download
  const handleDownload = async () => {
    if (!report?.id || downloadLoading) return;
    setDownloadLoading(true);
    try {
      const res = await downloadReportMutation.mutateAsync(report.id);
      if (res?.downloadUrl) {
        // Open short-lived signed URL securely
        window.open(res.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      toast('Failed to generate download link. Please try again.', 'error');
    } finally {
      setDownloadLoading(false);
    }
  };

  if (isOrderLoading) {
    return (
      <div className="py-16 bg-slate-50 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4 space-y-6">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Card className="p-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  const orderStatus = order?.status || 'PAID';
  const reportStatus = report?.status as ReportStatus | undefined;

  return (
    <div className="py-16 bg-slate-50 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('statusTitle')}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {t('orderRef')}: <span className="font-mono font-semibold">{orderId.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Stepper Tracker */}
        <Card className="p-6 border-slate-200 shadow-sm">
          <ReportStatusTracker
            orderStatus={orderStatus}
            reportStatus={reportStatus}
          />
        </Card>

        {/* State Content Card */}
        <Card className="p-8 border-slate-200 shadow-sm text-center">
          {/* RELEASED */}
          {reportStatus === 'RELEASED' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {t('statusReleased')}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your assessment has been fully evaluated and your comprehensive diagnostic report is ready for download.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownload}
                  isLoading={downloadLoading}
                  leftIcon={<Download className="w-5 h-5" />}
                  className="w-full sm:w-auto px-8 shadow-sm bg-emerald-600 hover:bg-emerald-700"
                >
                  {downloadLoading ? t('downloading') : t('downloadPdf')}
                </Button>
              </div>

              {/* In-page summary view if released content exists */}
              {report?.content && (
                <div className="mt-8 pt-6 border-t border-slate-200 text-left">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-brand-600" />
                    <span>Executive Summary</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {typeof report.content === 'object' && report.content.executiveSummary
                      ? report.content.executiveSummary
                      : typeof report.content === 'string'
                      ? report.content
                      : JSON.stringify(report.content, null, 2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PENDING_REVIEW */}
          {reportStatus === 'PENDING_REVIEW' && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <div className="inline-block mb-3">
                  <StatusBadge status="PENDING_REVIEW" size="lg" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Specialized Quality Review
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t('statusPendingReview')}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md mx-auto flex items-start space-x-2.5 text-left">
                <Mail className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{t('emailNotice')}</span>
              </div>
            </div>
          )}

          {/* FAILED / REJECTED */}
          {(reportStatus === 'FAILED' || reportStatus === 'REJECTED') && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-xs border border-rose-200">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {reportStatus === 'REJECTED' ? t('statusRejected') : t('statusFailed')}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Please reach out to our team with your order reference. We will resolve this promptly.
                </p>
              </div>

              <Link href="/contact">
                <Button variant="outline" size="md" leftIcon={<LifeBuoy className="w-4 h-4" />}>
                  {t('contactSupport')}
                </Button>
              </Link>
            </div>
          )}

          {/* GENERATING / QUEUED / PAID (In Progress) */}
          {reportStatus !== 'RELEASED' &&
            reportStatus !== 'PENDING_REVIEW' &&
            reportStatus !== 'FAILED' &&
            reportStatus !== 'REJECTED' && (
              <div className="space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs border border-brand-200">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Generating Your Report
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {reportStatus === 'QUEUED' ? t('statusQueued') : t('statusGenerating')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md mx-auto flex items-start space-x-2.5 text-left">
                  <Mail className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>{t('emailNotice')}</span>
                </div>

                {hasExceededTenMinutes && (
                  <p className="text-xs text-amber-700 font-medium">
                    Analysis is taking longer than usual. You may safely close this tab; we will email your report as soon as it is generated.
                  </p>
                )}
              </div>
            )}
        </Card>
      </div>
    </div>
  );
}

