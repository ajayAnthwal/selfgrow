'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface TimerProps {
  hasTimeLimit: boolean;
  formattedTime: string;
  isWarning: boolean;
  isUrgent: boolean;
  ariaAnnouncement: string | null;
}

export function Timer({
  hasTimeLimit,
  formattedTime,
  isWarning,
  isUrgent,
  ariaAnnouncement,
}: TimerProps) {
  const t = useTranslations('assessment');

  if (!hasTimeLimit) return null;

  return (
    <div className="relative">
      {/* Screen reader announcement container */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </span>

      <div
        className={cn(
          'inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-bold tracking-wider transition-colors',
          isUrgent && 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse',
          isWarning && !isUrgent && 'bg-amber-50 border-amber-300 text-amber-800',
          !isWarning && !isUrgent && 'bg-slate-100 border-slate-200 text-slate-700'
        )}
        title={t('timeRemaining')}
        role="timer"
        aria-label={`${t('timeRemaining')}: ${formattedTime}`}
      >
        {isUrgent ? (
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        ) : (
          <Clock className="w-4 h-4 text-slate-500" />
        )}
        <span>{formattedTime}</span>
      </div>
    </div>
  );
}

