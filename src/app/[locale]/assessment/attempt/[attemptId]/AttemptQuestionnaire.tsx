'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  DetailedAttempt,
  SavedResponse,
  useAutosave,
  useServerTimer,
  useAttemptNavigation,
  useSubmitAttempt,
  QuestionRenderer,
  ProgressBar,
  SectionHeader,
  QuestionNav,
  Timer,
  SaveStatusIndicator,
  SubmitDialog,
  QuestionPalette,
} from '@/features/assessment';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ApiClientError } from '@/lib/api/client';
import { mapErrorCode } from '@/lib/utils/errors';
import { LayoutGrid, X, AlertTriangle } from 'lucide-react';

interface AttemptQuestionnaireProps {
  attempt: DetailedAttempt;
  refetchAttempt: () => Promise<any>;
}

export function AttemptQuestionnaire({
  attempt,
  refetchAttempt,
}: AttemptQuestionnaireProps) {
  const t = useTranslations('assessment');
  const tErrors = useTranslations('errors');
  const router = useRouter();

  // If already submitted or expired, navigate to done screen immediately
  useEffect(() => {
    if (attempt.status === 'SUBMITTED' || attempt.status === 'EXPIRED') {
      router.replace(`/assessment/attempt/${attempt.id}/done`);
    }
  }, [attempt.status, attempt.id, router]);

  // Local map of responses: questionId -> SavedResponse
  const [responsesMap, setResponsesMap] = useState<Map<string, SavedResponse>>(() => {
    const map = new Map<string, SavedResponse>();
    for (const r of attempt.savedResponses || []) {
      map.set(r.questionId, r);
    }
    return map;
  });

  // Re-sync with server updates when refetched
  useEffect(() => {
    setResponsesMap((prev) => {
      const next = new Map(prev);
      for (const r of attempt.savedResponses || []) {
        if (!next.has(r.questionId)) {
          next.set(r.questionId, r);
        }
      }
      return next;
    });
  }, [attempt.savedResponses]);

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isPaletteMobileOpen, setIsPaletteMobileOpen] = useState(false);
  const [timeExpiredModalOpen, setTimeExpiredModalOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Autosave hook
  const { status: saveStatus, pendingCount, recordAnswer, flush, retry: retrySave } = useAutosave({
    attemptId: attempt.id,
    debounceMs: 600,
  });

  const submitMutation = useSubmitAttempt();

  // Submit attempt logic
  const executeSubmission = useCallback(async () => {
    setSubmissionError(null);
    try {
      // 1. Flush any pending saves
      await flush();
      // 2. Submit to backend
      await submitMutation.mutateAsync(attempt.id);
      // 3. Navigate to done
      router.push(`/assessment/attempt/${attempt.id}/done`);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        if (err.code === 'ATTEMPT_EXPIRED') {
          router.push(`/assessment/attempt/${attempt.id}/done`);
          return;
        }
        const errorKey = mapErrorCode(err.code);
        setSubmissionError(tErrors(errorKey as any));
      } else {
        setSubmissionError(tErrors('GENERIC'));
      }
    }
  }, [attempt.id, flush, router, submitMutation, tErrors]);

  // Handle timer expiration
  const handleTimerExpire = useCallback(async () => {
    setTimeExpiredModalOpen(true);
    try {
      await flush();
      await submitMutation.mutateAsync(attempt.id);
    } catch {
      // Ignore expiration submit errors since backend marks it expired
    }
  }, [attempt.id, flush, submitMutation]);

  // Server Timer Hook
  const {
    hasTimeLimit,
    formattedTime,
    isWarning,
    isUrgent,
    ariaAnnouncement,
  } = useServerTimer({
    initialRemainingSeconds: attempt.remainingTimeSeconds,
    onExpire: handleTimerExpire,
    onResync: async () => {
      const res = await refetchAttempt();
      return res.data?.remainingTimeSeconds ?? null;
    },
  });

  // Navigation Hook
  const {
    currentIndex,
    currentQuestion,
    totalQuestions,
    isFirst,
    isLast,
    sectionChanged,
    goToNext,
    goToPrevious,
    goToIndex,
  } = useAttemptNavigation({
    questions: attempt.questions || [],
    disableKeyboardNav: isSubmitDialogOpen || isPaletteMobileOpen || timeExpiredModalOpen,
  });

  // Handle Answer Change
  const handleAnswerChange = useCallback(
    (ans: { selectedOptionIds?: string[]; textAnswer?: string }) => {
      if (!currentQuestion) return;

      const updatedResponse: SavedResponse = {
        questionId: currentQuestion.id,
        selectedOptionIds: ans.selectedOptionIds || [],
        textAnswer: ans.textAnswer ?? null,
        answeredAt: new Date().toISOString(),
      };

      // 1. Immediate optimistic update in UI
      setResponsesMap((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, updatedResponse);
        return next;
      });

      // 2. Dispatch to autosave
      const isDebounced = currentQuestion.type === 'TEXT';
      recordAnswer(
        {
          questionId: currentQuestion.id,
          selectedOptionIds: ans.selectedOptionIds,
          textAnswer: ans.textAnswer,
        },
        isDebounced
      );
    },
    [currentQuestion, recordAnswer]
  );

  const answeredCount = useMemo(() => {
    let count = 0;
    for (const q of attempt.questions || []) {
      const resp = responsesMap.get(q.id);
      if (!resp) continue;
      if (q.type === 'TEXT') {
        if (resp.textAnswer && resp.textAnswer.trim().length > 0) count++;
      } else {
        if (resp.selectedOptionIds && resp.selectedOptionIds.length > 0) count++;
      }
    }
    return count;
  }, [attempt.questions, responsesMap]);

  const currentResponse = currentQuestion ? responsesMap.get(currentQuestion.id) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Assessment Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Autosave Status Indicator */}
          <div className="flex items-center space-x-3">
            <SaveStatusIndicator
              status={saveStatus}
              pendingCount={pendingCount}
              onRetry={retrySave}
            />
          </div>

          {/* Right: Timer & Palette Toggle */}
          <div className="flex items-center space-x-3">
            {hasTimeLimit && (
              <Timer
                hasTimeLimit={hasTimeLimit}
                formattedTime={formattedTime}
                isWarning={isWarning}
                isUrgent={isUrgent}
                ariaAnnouncement={ariaAnnouncement}
              />
            )}

            {/* Mobile Palette Button */}
            <button
              type="button"
              onClick={() => setIsPaletteMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Open Question Palette"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Questionnaire Area */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-start">
            {/* Primary Question Column */}
            <div className="md:col-span-2 lg:col-span-3 space-y-6">
              {/* Progress bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <ProgressBar
                  current={currentIndex + 1}
                  total={totalQuestions}
                  answeredCount={answeredCount}
                />
              </div>

              {/* Section Header */}
              {currentQuestion?.section && (
                <SectionHeader sectionName={currentQuestion.section} />
              )}

              {/* Question Card */}
              {currentQuestion && (
                <Card className="p-6 sm:p-8 border-slate-200 shadow-xs">
                  <QuestionRenderer
                    question={currentQuestion}
                    questionNumber={currentIndex + 1}
                    value={currentResponse}
                    onChange={handleAnswerChange}
                  />

                  {/* Nav */}
                  <QuestionNav
                    isFirst={isFirst}
                    isLast={isLast}
                    onPrevious={goToPrevious}
                    onNext={goToNext}
                    onSubmitPrompt={() => setIsSubmitDialogOpen(true)}
                    isLoading={submitMutation.isPending}
                  />
                </Card>
              )}
            </div>

            {/* Desktop Question Palette Sidebar */}
            <aside className="hidden md:block md:col-span-1">
              <div className="sticky top-24">
                <QuestionPalette
                  questions={attempt.questions || []}
                  savedResponses={responsesMap}
                  currentIndex={currentIndex}
                  onSelectIndex={goToIndex}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Mobile Question Palette Modal Drawer */}
      <Modal
        isOpen={isPaletteMobileOpen}
        onClose={() => setIsPaletteMobileOpen(false)}
        title={t('paletteTitle')}
        size="md"
      >
        <div className="py-2">
          <QuestionPalette
            questions={attempt.questions || []}
            savedResponses={responsesMap}
            currentIndex={currentIndex}
            onSelectIndex={(idx) => {
              goToIndex(idx);
              setIsPaletteMobileOpen(false);
            }}
          />
        </div>
      </Modal>

      {/* Submit Confirmation Dialog */}
      <SubmitDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        questions={attempt.questions || []}
        savedResponses={responsesMap}
        onConfirmSubmit={executeSubmission}
        onJumpToQuestion={(idx) => goToIndex(idx)}
        isSubmitting={submitMutation.isPending}
        submissionError={submissionError}
      />

      {/* Time Expired Notification Modal */}
      <Modal
        isOpen={timeExpiredModalOpen}
        onClose={() => {
          setTimeExpiredModalOpen(false);
          router.push(`/assessment/attempt/${attempt.id}/done`);
        }}
        title={t('timeExpiredTitle')}
        size="sm"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('timeExpiredMessage')}
          </p>
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={() => router.push(`/assessment/attempt/${attempt.id}/done`)}
          >
            {t('continueToCheckout')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

