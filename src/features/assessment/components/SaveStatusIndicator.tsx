'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SaveStatus } from '../types';
import { Check, RefreshCw, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SaveStatusIndicatorProps {
  status: SaveStatus;
  pendingCount?: number;
  onRetry?: () => void;
}

export function SaveStatusIndicator({
  status,
  pendingCount = 0,
  onRetry,
}: SaveStatusIndicatorProps) {
  const t = useTranslations('assessment');

  if (status === 'saving') {
    return (
      <div className="inline-flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
        <span>{t('saving')}</span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="inline-flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
        <WifiOff className="w-3.5 h-3.5" />
        <span>{t('offlineRetrying')}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center space-x-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded border border-rose-300 font-medium transition-colors cursor-pointer"
        title="Tap to retry saving"
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>{t('saveFailedTapToRetry')}</span>
      </button>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1 text-xs text-emerald-700 font-medium">
      <Check className="w-3.5 h-3.5 text-emerald-600" />
      <span>{t('saved')}</span>
    </div>
  );
}

