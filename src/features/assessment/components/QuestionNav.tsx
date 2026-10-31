'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

export interface QuestionNavProps {
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmitPrompt: () => void;
  isLoading?: boolean;
}

export function QuestionNav({
  isFirst,
  isLast,
  onPrevious,
  onNext,
  onSubmitPrompt,
  isLoading = false,
}: QuestionNavProps) {
  const t = useTranslations('assessment');

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 mt-8">
      <Button
        variant="outline"
        size="md"
        onClick={onPrevious}
        disabled={isFirst || isLoading}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
        className="min-w-[110px]"
      >
        {t('previous')}
      </Button>

      {isLast ? (
        <Button
          variant="primary"
          size="md"
          onClick={onSubmitPrompt}
          disabled={isLoading}
          leftIcon={<CheckSquare className="w-4 h-4" />}
          className="min-w-[150px] shadow-sm bg-emerald-600 hover:bg-emerald-700"
        >
          {t('reviewSubmit')}
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={isLoading}
          rightIcon={<ChevronRight className="w-4 h-4" />}
          className="min-w-[110px]"
        >
          {t('next')}
        </Button>
      )}
    </div>
  );
}

