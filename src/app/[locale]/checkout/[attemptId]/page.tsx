'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { useAttempt } from '@/features/assessment/api';
import { CheckoutContainer } from './CheckoutContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApiClientError } from '@/lib/api/client';

export default function CheckoutPage() {
  const params = useParams();
  const attemptId = String(params?.attemptId || '');

  const { data: attempt, isLoading, isError, error, refetch } = useAttempt(attemptId);

  if (isLoading) {
    return (
      <div className="py-16 bg-slate-50 min-h-[75vh] flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4 space-y-6">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Card className="p-8 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
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
          title="Unable to load checkout"
          message={error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!attempt) {
    notFound();
  }

  return <CheckoutContainer attempt={attempt} />;
}
