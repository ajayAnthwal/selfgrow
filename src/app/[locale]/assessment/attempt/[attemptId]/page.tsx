'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import { useAttempt } from '@/features/assessment/api';
import { AttemptQuestionnaire } from './AttemptQuestionnaire';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiClientError } from '@/lib/api/client';

export default function AttemptPage() {
  const params = useParams();
  const attemptId = String(params?.attemptId || '');

  const { data: attempt, isLoading, isError, error, refetch } = useAttempt(attemptId);

  if (isLoading) {
    return (
      <div className="py-8 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Card className="p-8 space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <ErrorState
          title="Unable to load assessment attempt"
          message={error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!attempt) {
    notFound();
  }

  return <AttemptQuestionnaire attempt={attempt} refetchAttempt={refetch} />;
}

