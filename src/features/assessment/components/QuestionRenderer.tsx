'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AssessmentQuestion, SavedResponse } from '../types';
import { cn } from '@/lib/utils/cn';
import { Check, Circle } from 'lucide-react';

export interface QuestionRendererProps {
  question: AssessmentQuestion;
  questionNumber: number;
  value: SavedResponse | null | undefined;
  onChange: (value: { selectedOptionIds?: string[]; textAnswer?: string }) => void;
  error?: string | null;
}

export function QuestionRenderer({
  question,
  questionNumber,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  const t = useTranslations('assessment');

  const selectedOptionIds = value?.selectedOptionIds || [];
  const textAnswer = value?.textAnswer || '';

  const handleSingleChoiceSelect = (optionId: string) => {
    onChange({ selectedOptionIds: [optionId], textAnswer: undefined });
  };

  const handleMultiChoiceToggle = (optionId: string) => {
    const isSelected = selectedOptionIds.includes(optionId);
    const updated = isSelected
      ? selectedOptionIds.filter((id) => id !== optionId)
      : [...selectedOptionIds, optionId];
    onChange({ selectedOptionIds: updated, textAnswer: undefined });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onChange({ selectedOptionIds: [], textAnswer: newText });
  };

  return (
    <div className="w-full">
      <fieldset className="border-0 p-0 m-0">
        {/* Header / Question Prompt */}
        <legend className="w-full mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
              {t('question')} {questionNumber}
            </span>
            {question.isRequired && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Required *
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight">
            {question.text}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            {question.type === 'SINGLE_CHOICE' && t('singleChoiceHelp')}
            {question.type === 'MULTI_CHOICE' && t('multiChoiceHelp')}
            {question.type === 'TEXT' && t('textHelp')}
          </p>
        </legend>

        {/* SINGLE CHOICE */}
        {question.type === 'SINGLE_CHOICE' && (
          <div className="space-y-3" role="radiogroup" aria-label={question.text}>
            {question.options.map((option, idx) => {
              const isSelected = selectedOptionIds.includes(option.id);
              const letter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <label
                  key={option.id}
                  onClick={() => handleSingleChoiceSelect(option.id)}
                  className={cn(
                    'flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none text-left min-h-[58px]',
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  )}
                >
                  <input
                    type="radio"
                    name={`q_${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => handleSingleChoiceSelect(option.id)}
                    className="sr-only"
                    aria-label={option.label}
                  />
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors',
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    )}
                  >
                    {letter}
                  </div>
                  <span
                    className={cn(
                      'text-sm sm:text-base leading-relaxed flex-1',
                      isSelected ? 'font-semibold text-brand-950' : 'text-slate-700'
                    )}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* MULTI CHOICE */}
        {question.type === 'MULTI_CHOICE' && (
          <div className="space-y-3" role="group" aria-label={question.text}>
            {question.options.map((option, idx) => {
              const isSelected = selectedOptionIds.includes(option.id);

              return (
                <label
                  key={option.id}
                  onClick={() => handleMultiChoiceToggle(option.id)}
                  className={cn(
                    'flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none text-left min-h-[58px]',
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  )}
                >
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={isSelected}
                    onChange={() => handleMultiChoiceToggle(option.id)}
                    className="sr-only"
                    aria-label={option.label}
                  />
                  <div
                    className={cn(
                      'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'border-2 border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      'text-sm sm:text-base leading-relaxed flex-1',
                      isSelected ? 'font-semibold text-brand-950' : 'text-slate-700'
                    )}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* TEXT RESPONSE */}
        {question.type === 'TEXT' && (
          <div className="space-y-2">
            <textarea
              value={textAnswer}
              onChange={handleTextChange}
              maxLength={question.maxLength || 3000}
              placeholder="Type your response here..."
              rows={6}
              className={cn(
                'w-full rounded-xl border-2 p-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors resize-y leading-relaxed',
                error
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-brand-600'
              )}
            />
            {question.maxLength && (
              <div className="flex justify-end text-xs text-slate-500">
                {t('charCount', {
                  current: textAnswer.length,
                  max: question.maxLength,
                })}
              </div>
            )}
          </div>
        )}

        {/* Error message if validation failed */}
        {error && (
          <p className="mt-3 text-xs font-medium text-rose-600" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    </div>
  );
}

