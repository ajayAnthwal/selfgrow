'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface UseServerTimerProps {
  initialRemainingSeconds: number | null;
  onExpire?: () => void;
  onResync?: () => Promise<number | null>;
}

export function useServerTimer({
  initialRemainingSeconds,
  onExpire,
  onResync,
}: UseServerTimerProps) {
  const hasTimeLimit = initialRemainingSeconds !== null && initialRemainingSeconds !== undefined;

  // Track remaining seconds locally
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(initialRemainingSeconds);
  const [ariaAnnouncement, setAriaAnnouncement] = useState<string | null>(null);

  // Baseline performance.now() and target seconds
  const startPerfTimeRef = useRef<number>(performance.now());
  const initialSecondsRef = useRef<number>(initialRemainingSeconds ?? 0);
  const hasExpiredRef = useRef<boolean>(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const onResyncRef = useRef(onResync);
  onResyncRef.current = onResync;

  // Update target when initialRemainingSeconds changes from outside
  useEffect(() => {
    if (initialRemainingSeconds !== null && initialRemainingSeconds !== undefined) {
      initialSecondsRef.current = initialRemainingSeconds;
      startPerfTimeRef.current = performance.now();
      setRemainingSeconds(initialRemainingSeconds);
      if (initialRemainingSeconds <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpireRef.current?.();
      }
    }
  }, [initialRemainingSeconds]);

  // Handle re-syncing
  const triggerResync = useCallback(async () => {
    if (!hasTimeLimit || !onResyncRef.current || hasExpiredRef.current) return;
    try {
      const serverRemaining = await onResyncRef.current();
      if (serverRemaining !== null && serverRemaining !== undefined) {
        initialSecondsRef.current = serverRemaining;
        startPerfTimeRef.current = performance.now();
        setRemainingSeconds(Math.max(0, Math.floor(serverRemaining)));

        if (serverRemaining <= 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpireRef.current?.();
        }
      }
    } catch {
      // Re-sync failure is non-blocking; timer continues monotonic countdown
    }
  }, [hasTimeLimit]);

  // Main countdown loop via monotonic performance.now()
  useEffect(() => {
    if (!hasTimeLimit) return;

    const interval = setInterval(() => {
      const elapsedSeconds = (performance.now() - startPerfTimeRef.current) / 1000;
      const currentRemaining = Math.max(0, Math.ceil(initialSecondsRef.current - elapsedSeconds));

      setRemainingSeconds(currentRemaining);

      // Aria announcements at key thresholds only (300s, 60s, 0s)
      if (currentRemaining === 300) {
        setAriaAnnouncement('5 minutes remaining');
      } else if (currentRemaining === 60) {
        setAriaAnnouncement('1 minute remaining');
      } else if (currentRemaining === 0) {
        setAriaAnnouncement('Time is up');
      } else {
        setAriaAnnouncement(null);
      }

      // At zero, trigger expiration exactly once
      if (currentRemaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasTimeLimit]);

  // Background window focus, online reconnect, and 60s periodic re-sync
  useEffect(() => {
    if (!hasTimeLimit) return;

    const handleFocus = () => void triggerResync();
    const handleOnline = () => void triggerResync();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    const periodicResync = setInterval(() => {
      void triggerResync();
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      clearInterval(periodicResync);
    };
  }, [hasTimeLimit, triggerResync]);

  const formattedTime = useMemo(() => {
    if (remainingSeconds === null) return '';
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const isWarning = hasTimeLimit && remainingSeconds !== null && remainingSeconds <= 300 && remainingSeconds > 60;
  const isUrgent = hasTimeLimit && remainingSeconds !== null && remainingSeconds <= 60;

  return {
    remainingSeconds,
    formattedTime,
    hasTimeLimit,
    isWarning,
    isUrgent,
    hasExpired: hasExpiredRef.current,
    ariaAnnouncement,
    resync: triggerResync,
  };
}

