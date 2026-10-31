'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorState } from '@/components/ui/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    // Log unexpected errors
    console.error('Unhandled UI Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <ErrorState
        title={t('error')}
        message={error.message || undefined}
        onRetry={reset}
        retryText={t('retry')}
      />
    </div>
  );
}

