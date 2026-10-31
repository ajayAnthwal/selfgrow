'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

export interface LocalizedValue {
  en: string;
  hi: string;
}

interface LocalizedTextFieldProps {
  label: string;
  value: LocalizedValue;
  onChange: (value: LocalizedValue) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  error?: string;
  placeholderEn?: string;
  placeholderHi?: string;
  className?: string;
}

export function LocalizedTextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  required = false,
  error,
  placeholderEn,
  placeholderHi,
  className,
}: LocalizedTextFieldProps) {
  const t = useTranslations('admin.localized');

  const enValue = value?.en || '';
  const hiValue = value?.hi || '';
  const isMissingHindi = Boolean(enValue.trim() && !hiValue.trim());

  const handleEnChange = (en: string) => {
    onChange({ ...value, en });
  };

  const handleHiChange = (hi: string) => {
    onChange({ ...value, hi });
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isMissingHindi && (
          <Badge
            variant="warning"
            size="sm"
            className="flex items-center gap-1 text-[11px]"
            data-testid="missing-hindi-indicator"
          >
            <AlertCircle className="h-3 w-3" />
            {t('missingHindi')}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {t('englishLabel')}
          </span>
          {multiline ? (
            <textarea
              value={enValue}
              onChange={(e) => handleEnChange(e.target.value)}
              placeholder={placeholderEn || 'Enter English text'}
              rows={rows}
              className={cn(
                'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-100',
                error ? 'border-red-500 dark:border-red-500' : ''
              )}
            />
          ) : (
            <Input
              value={enValue}
              onChange={(e) => handleEnChange(e.target.value)}
              placeholder={placeholderEn || 'Enter English text'}
              className={error ? 'border-red-500' : ''}
            />
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            {t('hindiLabel')}
          </span>
          {multiline ? (
            <textarea
              value={hiValue}
              onChange={(e) => handleHiChange(e.target.value)}
              placeholder={placeholderHi || 'हिन्दी पाठ दर्ज करें'}
              rows={rows}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-100"
            />
          ) : (
            <Input
              value={hiValue}
              onChange={(e) => handleHiChange(e.target.value)}
              placeholder={placeholderHi || 'हिन्दी पाठ दर्ज करें'}
            />
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

