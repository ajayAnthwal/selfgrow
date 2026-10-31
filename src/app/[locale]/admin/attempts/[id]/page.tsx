'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft, Clock, Award, CheckCircle2, User } from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminAttempt } from '@/features/admin/api/adminApi';

export default function AdminAttemptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const id = params.id as string;

  const { data: attempt, isLoading, isError, refetch } = useAdminAttempt(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !attempt) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        <p className="font-medium">Failed to load attempt details.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
          Retry
        </Button>
      </div>
    );
  }

  // Group responses by section
  const responsesBySection = (attempt.responses || []).reduce(
    (acc: Record<string, any[]>, resp: any) => {
      const section = resp.section || 'General Evaluation';
      if (!acc[section]) acc[section] = [];
      acc[section].push(resp);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${locale}/admin/attempts`)}
          className="h-8 px-2 text-xs text-neutral-500"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Attempts
        </Button>
      </div>

      <PageHeader
        title={`Attempt Responses: ${attempt.user?.name || 'Candidate'}`}
        description={`Attempt ID: ${attempt.id} · Language: ${attempt.language} · Product: ${
          typeof attempt.product?.name === 'object'
            ? attempt.product.name[locale] || attempt.product.name.en
            : attempt.product?.name || attempt.productId
        }`}
        actions={<StatusBadge status={attempt.status} />}
      />

      {/* Meta Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <User className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Candidate</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {attempt.user?.name}
          </p>
          <p className="text-xs text-neutral-500">{attempt.user?.email}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Timeline</span>
          </div>
          <p className="mt-2 text-xs text-neutral-700 dark:text-neutral-300">
            Started: {new Date(attempt.startedAt).toLocaleString()}
          </p>
          <p className="text-xs text-neutral-700 dark:text-neutral-300">
            Submitted:{' '}
            {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'In Progress'}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-neutral-500">
            <Award className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Score Summary</span>
          </div>
          {attempt.scoreSummary ? (
            <div className="mt-2">
              <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {attempt.scoreSummary.totalScore ??
                  attempt.scoreSummary.overallScore ??
                  'Completed'}
              </p>
              {attempt.scoreSummary.dimensionScores && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {Object.entries(attempt.scoreSummary.dimensionScores).map(([dim, sc]) => (
                    <span
                      key={dim}
                      className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {dim}: {String(sc)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-xs text-neutral-400">Score summary not calculated yet.</p>
          )}
        </Card>
      </div>

      {/* Responses by Section */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          Candidate Submitted Answers ({attempt.responses?.length || 0})
        </h2>

        {Object.keys(responsesBySection).length === 0 ? (
          <Card className="p-8 text-center text-neutral-400">
            No saved responses found for this attempt.
          </Card>
        ) : (
          Object.entries(responsesBySection).map(([sectionTitle, questions]) => (
            <Card key={sectionTitle} className="overflow-hidden">
              <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  {sectionTitle}
                </h3>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {questions.map((q: any, idx: number) => (
                  <div key={q.questionId || idx} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            {q.order ?? idx + 1}
                          </span>
                          <span className="text-xs font-medium text-neutral-500 uppercase">
                            {q.type || 'QUESTION'}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {typeof q.questionText === 'object'
                            ? q.questionText[locale] || q.questionText.en
                            : q.questionText}
                        </p>
                      </div>

                      {q.timeTakenMs !== undefined && q.timeTakenMs !== null && (
                        <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                          {Math.round(q.timeTakenMs / 1000)}s
                        </span>
                      )}
                    </div>

                    {/* Answer Display */}
                    <div className="mt-3 pl-7">
                      {q.selectedOptionLabels && q.selectedOptionLabels.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase text-neutral-500">
                            Chosen Option(s):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {q.selectedOptionLabels.map((lbl: string, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              >
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                {lbl}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : q.textAnswer ? (
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase text-neutral-500">
                            Text Response:
                          </p>
                          <div className="rounded-md bg-neutral-50 p-3 text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                            {q.textAnswer}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs italic text-neutral-400">No answer provided.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

