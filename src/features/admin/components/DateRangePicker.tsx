'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar } from 'lucide-react';

export interface DateRangeValue {
  from: string;
  to: string;
  preset?: 'today' | '7d' | '30d' | 'custom';
}

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

export function computePresetRange(preset: 'today' | '7d' | '30d'): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString();

  let fromDate = new Date();
  if (preset === 'today') {
    fromDate.setHours(0, 0, 0, 0);
  } else if (preset === '7d') {
    fromDate.setDate(now.getDate() - 7);
  } else if (preset === '30d') {
    fromDate.setDate(now.getDate() - 30);
  }

  return {
    from: fromDate.toISOString(),
    to,
  };
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const t = useTranslations('admin.dateRange');
  const [isCustomOpen, setIsCustomOpen] = useState(value.preset === 'custom');
  const [customFrom, setCustomFrom] = useState(
    value.from ? value.from.split('T')[0] : ''
  );
  const [customTo, setCustomTo] = useState(
    value.to ? value.to.split('T')[0] : ''
  );

  const handleSelectPreset = (preset: 'today' | '7d' | '30d') => {
    setIsCustomOpen(false);
    const range = computePresetRange(preset);
    onChange({
      ...range,
      preset,
    });
  };

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) return;
    const fromDate = new Date(customFrom);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(customTo);
    toDate.setHours(23, 59, 59, 999);

    onChange({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      preset: 'custom',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="inline-flex items-center rounded-xl border border-border bg-surface p-1 shadow-xs">
        <button
          type="button"
          onClick={() => handleSelectPreset('today')}
          className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all ${
            value.preset === 'today'
              ? 'bg-primary text-white shadow-xs'
              : 'text-body hover:text-heading hover:bg-surface-secondary'
          }`}
        >
          {t('presetToday') || 'Today'}
        </button>
        <button
          type="button"
          onClick={() => handleSelectPreset('7d')}
          className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all ${
            value.preset === '7d'
              ? 'bg-primary text-white shadow-xs'
              : 'text-body hover:text-heading hover:bg-surface-secondary'
          }`}
        >
          {t('preset7d') || 'Last 7 Days'}
        </button>
        <button
          type="button"
          onClick={() => handleSelectPreset('30d')}
          className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-all ${
            value.preset === '30d'
              ? 'bg-primary text-white shadow-xs'
              : 'text-body hover:text-heading hover:bg-surface-secondary'
          }`}
        >
          {t('preset30d') || 'Last 30 Days'}
        </button>
        <button
          type="button"
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={`h-8 px-3.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
            value.preset === 'custom' || isCustomOpen
              ? 'bg-primary text-white shadow-xs'
              : 'text-body hover:text-heading hover:bg-surface-secondary'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{t('presetCustom') || 'Custom Range'}</span>
        </button>
      </div>

      {isCustomOpen && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1.5 shadow-xs">
          <Input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="h-8 py-0 text-xs bg-surface border-input-border text-heading"
          />
          <span className="text-xs text-muted font-medium">to</span>
          <Input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="h-8 py-0 text-xs bg-surface border-input-border text-heading"
          />
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleApplyCustom}
            disabled={!customFrom || !customTo}
            className="h-8 px-3 text-xs font-semibold"
          >
            {t('apply') || 'Apply'}
          </Button>
        </div>
      )}
    </div>
  );
}
