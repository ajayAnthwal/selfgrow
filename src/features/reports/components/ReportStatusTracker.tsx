'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ReportStatus } from '../types';
import { Check, Loader2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ReportStatusTrackerProps {
  orderStatus: string; // 'PAID', etc.
  reportStatus?: ReportStatus | null;
  className?: string;
}

export function ReportStatusTracker({
  orderStatus,
  reportStatus,
  className,
}: ReportStatusTrackerProps) {
  const t = useTranslations('reports');

  // Step 1: Paid
  const isPaid = orderStatus === 'PAID';

  // Step 2: Generating
  const isGenerating =
    isPaid &&
    (reportStatus === 'QUEUED' ||
      reportStatus === 'GENERATING' ||
      reportStatus === 'GENERATED' ||
      reportStatus === 'PENDING_REVIEW');

  // Step 3: Ready
  const isReady = reportStatus === 'RELEASED';

  const steps = [
    {
      id: 1,
      title: t('trackerPaid'),
      isCompleted: isPaid,
      isActive: isPaid && !isGenerating && !isReady,
      icon: Check,
    },
    {
      id: 2,
      title: t('trackerGenerating'),
      isCompleted: isReady,
      isActive: isGenerating,
      icon: isGenerating ? Loader2 : Sparkles,
    },
    {
      id: 3,
      title: t('trackerReady'),
      isCompleted: isReady,
      isActive: isReady,
      icon: isReady ? CheckCircle2 : FileText,
    },
  ];

  return (
    <div className={cn('w-full py-4', className)}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isReady
          ? t('trackerReady')
          : isGenerating
          ? t('trackerGenerating')
          : t('trackerPaid')}
      </div>

      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-slate-200 -z-0" />

        {/* Active progress connector line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 -z-0"
          style={{
            width: isReady ? '100%' : isGenerating ? '50%' : '15%',
          }}
        />

        {steps.map((step) => {
          const StepIcon = step.icon;
          const isSpinner = step.isActive && step.id === 2;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors border-2 shadow-2xs',
                  step.isCompleted || step.isActive
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                )}
              >
                <StepIcon
                  className={cn(
                    'w-5 h-5',
                    isSpinner && 'animate-spin stroke-[2.5]'
                  )}
                />
              </div>

              <span
                className={cn(
                  'mt-2 text-xs font-semibold whitespace-nowrap',
                  step.isCompleted || step.isActive
                    ? 'text-slate-900'
                    : 'text-slate-400'
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

