'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AssessmentQuestion, SavedResponse } from '../types';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface QuestionPaletteProps {
  questions: AssessmentQuestion[];
  savedResponses: Map<string, SavedResponse>;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  className?: string;
}

export function QuestionPalette({
  questions,
  savedResponses,
  currentIndex,
  onSelectIndex,
  className,
}: QuestionPaletteProps) {
  const t = useTranslations('assessment');

  const isQuestionAnswered = (q: AssessmentQuestion) => {
    const resp = savedResponses.get(q.id);
    if (!resp) return false;
    if (q.type === 'TEXT') {
      return Boolean(resp.textAnswer && resp.textAnswer.trim().length > 0);
    }
    return Boolean(resp.selectedOptionIds && resp.selectedOptionIds.length > 0);
  };

  return (
    <Card className={cn('p-4 sm:p-5 border-slate-200', className)}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        {t('paletteTitle')}
      </h3>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-1">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = isQuestionAnswered(q);
          const isMissingRequired = q.isRequired && !isAnswered;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={cn(
                'relative h-9 w-full rounded-lg text-xs font-semibold flex items-center justify-center transition-all border',
                isCurrent && 'ring-2 ring-brand-600 border-brand-500 font-bold bg-brand-50 text-brand-900',
                !isCurrent && isAnswered && 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
                !isCurrent && !isAnswered && 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              )}
              aria-label={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
            >
              <span>{idx + 1}</span>
              {isMissingRequired && !isCurrent && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] text-slate-500">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300" />
          <span>{t('paletteAnswered')}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-white border border-slate-200" />
          <span>{t('paletteUnanswered')}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-brand-50 border-2 border-brand-500" />
          <span>{t('paletteCurrent')}</span>
        </div>
      </div>
    </Card>
  );
}

