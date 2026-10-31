'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AssessmentQuestion, SavedResponse } from '../types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questions: AssessmentQuestion[];
  savedResponses: Map<string, SavedResponse>;
  onConfirmSubmit: () => Promise<void>;
  onJumpToQuestion: (index: number) => void;
  isSubmitting: boolean;
  submissionError?: string | null;
}

export function SubmitDialog({
  isOpen,
  onClose,
  questions,
  savedResponses,
  onConfirmSubmit,
  onJumpToQuestion,
  isSubmitting,
  submissionError,
}: SubmitDialogProps) {
  const t = useTranslations('assessment');

  const total = questions.length;

  const isAnswered = (q: AssessmentQuestion) => {
    const resp = savedResponses.get(q.id);
    if (!resp) return false;
    if (q.type === 'TEXT') {
      return Boolean(resp.textAnswer && resp.textAnswer.trim().length > 0);
    }
    return Boolean(resp.selectedOptionIds && resp.selectedOptionIds.length > 0);
  };

  const answeredCount = questions.filter(isAnswered).length;
  const missingRequired = questions
    .map((q, idx) => ({ question: q, index: idx }))
    .filter(({ question }) => question.isRequired && !isAnswered(question));

  const hasMissingRequired = missingRequired.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={t('submitDialogTitle')}
      description={t('submitDialogDescription')}
      size="md"
    >
      <div className="space-y-4 my-2">
        {/* Submission Error Banner */}
        {submissionError && (
          <div
            className="flex items-start space-x-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
            role="alert"
          >
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* Status summary */}
        <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
            {answeredCount}/{total}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {t('answeredCount', { answered: answeredCount, total })}
            </div>
            <div className="text-xs text-slate-500">
              {!hasMissingRequired ? t('allAnswered') : `${missingRequired.length} required question(s) pending`}
            </div>
          </div>
        </div>

        {/* Missing Required Questions Warning & Jump Links */}
        {hasMissingRequired ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-3">
            <div className="flex items-start space-x-2 text-rose-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{t('unansweredWarning', { count: missingRequired.length })}</span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {missingRequired.map(({ question, index }) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpToQuestion(index);
                  }}
                  className="w-full text-left text-xs bg-white hover:bg-rose-100/50 p-2 rounded-lg border border-rose-200 text-rose-900 flex items-center justify-between transition-colors group"
                >
                  <span className="font-medium line-clamp-1">
                    #{index + 1}: {question.text}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-700 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>All required questions have been fulfilled. Ready to finalize.</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onConfirmSubmit}
          isLoading={isSubmitting}
          disabled={hasMissingRequired || isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? t('submitting') : t('confirmSubmit')}
        </Button>
      </div>
    </Modal>
  );
}

