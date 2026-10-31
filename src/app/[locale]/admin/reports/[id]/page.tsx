'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  ArrowLeft,
  FileCheck,
  RotateCcw,
  XCircle,
  Edit,
  Download,
  History,
  AlertTriangle,
  User,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { JsonViewer } from '@/features/admin/components/JsonViewer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import {
  useAdminReport,
  useUpdateReportContent,
  useReleaseReport,
  useRegenerateReport,
  useRejectReport,
} from '@/features/admin/api/adminApi';
import Link from 'next/link';

export default function AdminReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.reports');
  const id = params.id as string;

  const { data: report, isLoading, isError, refetch } = useAdminReport(id);

  const updateContentMutation = useUpdateReportContent(id);
  const releaseMutation = useReleaseReport(id);
  const regenerateMutation = useRegenerateReport(id);
  const rejectMutation = useRejectReport(id);

  // Dialog States
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [selectedRevisionDiff, setSelectedRevisionDiff] = useState<any | null>(null);

  // Edit Content State
  const [contentJsonStr, setContentJsonStr] = useState('');
  const [editReason, setEditReason] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleOpenEdit = () => {
    setContentJsonStr(JSON.stringify(report?.content || {}, null, 2));
    setEditReason('');
    setJsonError('');
    setIsEditContentModalOpen(true);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(contentJsonStr);
      setJsonError('');
      await updateContentMutation.mutateAsync({
        content: parsed,
        reason: editReason.trim() || undefined,
      });
      setIsEditContentModalOpen(false);
    } catch (err: any) {
      setJsonError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleConfirmRelease = async () => {
    await releaseMutation.mutateAsync();
    setIsReleaseDialogOpen(false);
  };

  const handleConfirmRegenerate = async (reason?: string) => {
    if (!reason?.trim()) return;
    await regenerateMutation.mutateAsync({ reason });
    setIsRegenerateDialogOpen(false);
  };

  const handleConfirmReject = async (reason?: string) => {
    if (!reason?.trim()) return;
    await rejectMutation.mutateAsync({ reason });
    setIsRejectDialogOpen(false);
  };

  const handleDownloadPdf = () => {
    const downloadUrl = `/api/v1/reports/${id}/download`;
    window.open(downloadUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        <p className="font-medium">Failed to load report review details.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
          Retry
        </Button>
      </div>
    );
  }

  const sections = report.content?.sections || report.content;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${locale}/admin/reports`)}
          className="h-8 px-2 text-xs text-neutral-500"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Reports Review
        </Button>
      </div>

      <PageHeader
        title={`Review Report: ${report.order?.user?.name || 'Candidate'}`}
        description={`Report ID: ${report.id} · Revision: v${report.version} · Created: ${new Date(
          report.createdAt
        ).toLocaleString()}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              className="text-xs"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {t('previewPdf')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenEdit}
              className="text-xs"
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              {t('editContent')}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsRejectDialogOpen(true)}
              className="text-xs"
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              {t('reject')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRegenerateDialogOpen(true)}
              className="text-xs"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              {t('regenerate')}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsReleaseDialogOpen(true)}
              disabled={report.status === 'RELEASED'}
              className="text-xs"
            >
              <FileCheck className="mr-1.5 h-3.5 w-3.5" />
              {t('release')}
            </Button>
          </div>
        }
      />

      {report.errorMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="text-xs font-semibold uppercase">AI Generation Failure Details</p>
            <p className="mt-1 text-xs">{report.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Content (Left) & Side Panel (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Rendered Content Sections */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Rendered Report Findings
              </h3>
              <StatusBadge status={report.status} />
            </div>

            {!report.content ? (
              <p className="py-8 text-center text-xs text-neutral-400">
                Report content is not generated or is currently empty.
              </p>
            ) : typeof sections === 'object' && Array.isArray(sections) ? (
              <div className="space-y-6">
                {sections.map((sec: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      {sec.title || `Section ${idx + 1}`}
                    </h4>
                    <div className="rounded-lg bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                      {typeof sec.body === 'string' ? (
                        <p>{sec.body}</p>
                      ) : (
                        <JsonViewer data={sec} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <JsonViewer data={report.content} title="Report Structured JSON" />
              </div>
            )}
          </Card>

          {/* Revision History & Diff */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-neutral-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  {t('revisions')} ({report.revisions?.length || 0})
                </h3>
              </div>
            </div>

            {!report.revisions || report.revisions.length === 0 ? (
              <p className="text-xs text-neutral-400">No revisions recorded for this report.</p>
            ) : (
              <div className="space-y-3">
                {report.revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-start justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                          v{rev.version}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          by {rev.editedBy || 'System/Admin'} · {new Date(rev.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {rev.reason && (
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                          Reason: {rev.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRevisionDiff(rev)}
                      className="h-7 text-xs"
                    >
                      {t('diff')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Side Panel: Order, User, Attempt Info */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {t('candidateInfo')}
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-neutral-500">Candidate Name</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {report.order?.user?.name}
                </p>
              </div>

              <div>
                <p className="text-neutral-500">Email Address</p>
                <p className="font-mono text-neutral-700 dark:text-neutral-300">
                  {report.order?.user?.email}
                </p>
              </div>

              <div>
                <p className="text-neutral-500">Benchmark Product</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {typeof report.order?.product?.name === 'object'
                    ? report.order.product.name[locale] || report.order.product.name.en
                    : report.order?.product?.name}
                </p>
              </div>

              <div>
                <p className="text-neutral-500">Order ID</p>
                <p className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                  {report.orderId}
                </p>
              </div>

              {report.order?.attemptId && (
                <div className="pt-2">
                  <Link href={`/${locale}/admin/attempts/${report.order.attemptId}`}>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Inspect Attempt Answers →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Content Modal */}
      <Modal
        isOpen={isEditContentModalOpen}
        onClose={() => setIsEditContentModalOpen(false)}
        title="Edit Diagnostic Content"
        size="xl"
      >
        <form onSubmit={handleSaveContent} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Report Content JSON
              </label>
              {jsonError && (
                <span className="text-xs font-medium text-red-500">{jsonError}</span>
              )}
            </div>
            <textarea
              value={contentJsonStr}
              onChange={(e) => setContentJsonStr(e.target.value)}
              rows={12}
              className={`w-full rounded-md border p-3 font-mono text-xs dark:bg-neutral-900 ${
                jsonError ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              Revision Reason
            </label>
            <input
              type="text"
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder="e.g. Corrected clinical phrasing for recommendations"
              className="w-full rounded-md border border-neutral-300 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditContentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={updateContentMutation.isPending}
            >
              Save Revision
            </Button>
          </div>
        </form>
      </Modal>

      {/* Revision Diff Modal */}
      <Modal
        isOpen={Boolean(selectedRevisionDiff)}
        onClose={() => setSelectedRevisionDiff(null)}
        title={`Revision v${selectedRevisionDiff?.version} Payload`}
        size="lg"
      >
        {selectedRevisionDiff && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Author: {selectedRevisionDiff.editedBy}</span>
              <span>{new Date(selectedRevisionDiff.createdAt).toLocaleString()}</span>
            </div>
            {selectedRevisionDiff.reason && (
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                Reason: {selectedRevisionDiff.reason}
              </p>
            )}
            <JsonViewer data={selectedRevisionDiff.content} title="Revision Content" />
          </div>
        )}
      </Modal>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={isReleaseDialogOpen}
        onClose={() => setIsReleaseDialogOpen(false)}
        onConfirm={handleConfirmRelease}
        title="Release Diagnostic Report?"
        description="Releasing will finalize the report, regenerate the official PDF, and dispatch the completion notification email to the candidate."
        confirmLabel="Release & Dispatch"
        variant="primary"
        isLoading={releaseMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isRegenerateDialogOpen}
        onClose={() => setIsRegenerateDialogOpen(false)}
        onConfirm={handleConfirmRegenerate}
        title="Regenerate Report with AI?"
        description="This will send the attempt back to the AI generation queue with the latest prompt template."
        confirmLabel="Regenerate"
        variant="primary"
        requireReason
        reasonPlaceholder="e.g. Output was truncated by provider timeout"
        isLoading={regenerateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleConfirmReject}
        title="Reject Report Generation?"
        description="Mark this diagnostic report as REJECTED. Please specify the compliance or quality reason."
        confirmLabel="Reject Report"
        variant="danger"
        requireReason
        reasonPlaceholder="e.g. Insufficient response length in subjective sections"
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}

