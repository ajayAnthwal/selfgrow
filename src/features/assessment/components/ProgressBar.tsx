'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export interface ProgressBarProps {
  current: number; // 1-based question number
  total: number;
  answeredCount: number;
}

export function ProgressBar({ current, total, answeredCount }: ProgressBarProps) {
  const t = useTranslations('assessment');

  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const answeredPercentage = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>
          {t('question')} <strong className="text-slate-900">{current}</strong> {t('of')}{' '}
          <strong className="text-slate-900">{total}</strong>
        </span>
        <span>
          {t('answeredCount', { answered: answeredCount, total })}
        </span>
      </div>

      {/* Track */}
      <div
        className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

