'use client';

import { useState, useCallback, useEffect } from 'react';
import { AssessmentQuestion } from '../types';

export interface UseAttemptNavigationProps {
  questions: AssessmentQuestion[];
  initialIndex?: number;
  disableKeyboardNav?: boolean;
}

export function useAttemptNavigation({
  questions,
  initialIndex = 0,
  disableKeyboardNav = false,
}: UseAttemptNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  const total = questions.length;
  const safeIndex = Math.max(0, Math.min(currentIndex, Math.max(0, total - 1)));
  const currentQuestion = questions[safeIndex] || null;

  const previousQuestion = safeIndex > 0 ? questions[safeIndex - 1] : null;
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === total - 1;

  // Section changed check
  const sectionChanged = Boolean(
    currentQuestion?.section &&
      (!previousQuestion || previousQuestion.section !== currentQuestion.section)
  );

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  }, [total]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < total) {
        setCurrentIndex(index);
      }
    },
    [total]
  );

  // Keyboard navigation (ArrowLeft & ArrowRight) when focus is not inside an input/textarea
  useEffect(() => {
    if (disableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'textarea' || activeTag === 'input') {
        return;
      }

      if (e.key === 'ArrowRight' && !isLast) {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disableKeyboardNav, isFirst, isLast, goToNext, goToPrevious]);

  return {
    currentIndex: safeIndex,
    currentQuestion,
    totalQuestions: total,
    isFirst,
    isLast,
    sectionChanged,
    goToNext,
    goToPrevious,
    goToIndex,
  };
}

