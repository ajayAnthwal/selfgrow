'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { api, ApiClientError } from '@/lib/api/client';
import { AnswerItem, SaveStatus } from '../types';

export interface UseAutosaveProps {
  attemptId: string;
  debounceMs?: number;
}

export function useAutosave({ attemptId, debounceMs = 600 }: UseAutosaveProps) {
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [pendingCount, setPendingCount] = useState<number>(0);

  // In-memory queue of pending answers (questionId -> AnswerItem)
  const pendingQueueRef = useRef<Map<string, AnswerItem>>(new Map());
  // Tracks timestamps to prevent race conditions (questionId -> last modified timestamp)
  const lastModifiedMapRef = useRef<Map<string, number>>(new Map());
  // Active timeout handle for debounced text saves
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Retry timer
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  // Active in-flight save promise
  const inFlightPromiseRef = useRef<Promise<void> | null>(null);

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  // Flush and execute save
  const executeSave = useCallback(async (): Promise<void> => {
    clearDebounceTimer();
    clearRetryTimer();

    // If an in-flight save is currently running, wait for it then re-run if more items arrived
    if (inFlightPromiseRef.current) {
      await inFlightPromiseRef.current;
      if (pendingQueueRef.current.size === 0) return;
    }

    if (pendingQueueRef.current.size === 0) {
      setStatus('saved');
      setPendingCount(0);
      return;
    }

    const itemsToSave = Array.from(pendingQueueRef.current.values());
    const snapshotTimestamps = new Map<string, number>();
    for (const item of itemsToSave) {
      snapshotTimestamps.set(item.questionId, lastModifiedMapRef.current.get(item.questionId) || 0);
    }

    setStatus('saving');

    const savePromise = (async () => {
      try {
        await api.put(`/attempts/${attemptId}/answers`, {
          answers: itemsToSave,
        });

        // Clear only those answers that have not been modified since snapshot
        for (const item of itemsToSave) {
          const snapshotTs = snapshotTimestamps.get(item.questionId) || 0;
          const currentTs = lastModifiedMapRef.current.get(item.questionId) || 0;
          if (snapshotTs >= currentTs) {
            pendingQueueRef.current.delete(item.questionId);
          }
        }

        retryCountRef.current = 0;
        setPendingCount(pendingQueueRef.current.size);

        if (pendingQueueRef.current.size > 0) {
          // Additional modifications arrived during in-flight save
          void executeSave();
        } else {
          setStatus('saved');
        }
      } catch (err: any) {
        const isNetworkError =
          (err instanceof ApiClientError && err.code === 'NETWORK_ERROR') ||
          err?.name === 'TypeError' ||
          !navigator.onLine;

        if (isNetworkError && retryCountRef.current < 4) {
          retryCountRef.current += 1;
          setStatus('offline');
          const delay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 8000);
          retryTimerRef.current = setTimeout(() => {
            void executeSave();
          }, delay);
        } else {
          setStatus('error');
        }
      } finally {
        inFlightPromiseRef.current = null;
      }
    })();

    inFlightPromiseRef.current = savePromise;
    return savePromise;
  }, [attemptId, clearDebounceTimer, clearRetryTimer]);

  // Record an answer into the pending queue
  const recordAnswer = useCallback(
    (answer: AnswerItem, isDebounced: boolean = false) => {
      const now = Date.now();
      pendingQueueRef.current.set(answer.questionId, answer);
      lastModifiedMapRef.current.set(answer.questionId, now);
      setPendingCount(pendingQueueRef.current.size);

      clearDebounceTimer();

      if (isDebounced) {
        setStatus('saving');
        debounceTimerRef.current = setTimeout(() => {
          void executeSave();
        }, debounceMs);
      } else {
        // Immediate save for single/multi choice
        void executeSave();
      }
    },
    [clearDebounceTimer, debounceMs, executeSave]
  );

  // Manual retry trigger (e.g., tap on status indicator)
  const retry = useCallback(() => {
    retryCountRef.current = 0;
    void executeSave();
  }, [executeSave]);

  // Flush method for submit / navigation
  const flush = useCallback(async (): Promise<void> => {
    clearDebounceTimer();
    clearRetryTimer();
    return executeSave();
  }, [clearDebounceTimer, clearRetryTimer, executeSave]);

  const statusRef = useRef(status);
  statusRef.current = status;

  // Beforeunload warning only when unsaved answers exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingQueueRef.current.size > 0 || statusRef.current === 'saving' || statusRef.current === 'error') {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearDebounceTimer();
      clearRetryTimer();
    };
  }, [clearDebounceTimer, clearRetryTimer]);

  return {
    status,
    pendingCount,
    recordAnswer,
    flush,
    retry,
  };
}
