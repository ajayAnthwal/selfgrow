import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useServerTimer } from '../src/features/assessment/hooks/useServerTimer';

describe('useServerTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders no time limit when initialRemainingSeconds is null', () => {
    const { result } = renderHook(() =>
      useServerTimer({ initialRemainingSeconds: null })
    );

    expect(result.current.hasTimeLimit).toBe(false);
    expect(result.current.remainingSeconds).toBeNull();
    expect(result.current.formattedTime).toBe('');
  });

  it('counts down and formats mm:ss correctly', () => {
    let mockPerfNow = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => mockPerfNow);

    const { result } = renderHook(() =>
      useServerTimer({ initialRemainingSeconds: 90 }) // 1m 30s
    );

    expect(result.current.hasTimeLimit).toBe(true);
    expect(result.current.formattedTime).toBe('01:30');

    act(() => {
      mockPerfNow += 15000; // 15 seconds elapsed
      vi.advanceTimersByTime(15000);
    });

    expect(result.current.remainingSeconds).toBe(75);
    expect(result.current.formattedTime).toBe('01:15');
  });

  it('ignores Date.now() system clock changes because it uses performance.now()', () => {
    let mockPerfNow = 5000;
    vi.spyOn(performance, 'now').mockImplementation(() => mockPerfNow);

    const { result } = renderHook(() =>
      useServerTimer({ initialRemainingSeconds: 100 })
    );

    // Tamper with system clock by changing Date.now()
    const originalDateNow = Date.now;
    Date.now = vi.fn().mockReturnValue(originalDateNow() + 10000000);

    act(() => {
      mockPerfNow += 5000; // only 5s passed monotonically
      vi.advanceTimersByTime(5000);
    });

    // Should only have deducted 5 seconds
    expect(result.current.remainingSeconds).toBe(95);

    Date.now = originalDateNow;
  });

  it('triggers onExpire at zero exactly once', () => {
    let mockPerfNow = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => mockPerfNow);

    const onExpireMock = vi.fn();

    const { result } = renderHook(() =>
      useServerTimer({ initialRemainingSeconds: 3, onExpire: onExpireMock })
    );

    expect(onExpireMock).not.toHaveBeenCalled();

    act(() => {
      mockPerfNow += 3500;
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.remainingSeconds).toBe(0);
    expect(onExpireMock).toHaveBeenCalledTimes(1);

    // Further timer ticks do not call onExpire again
    act(() => {
      mockPerfNow += 5000;
      vi.advanceTimersByTime(5000);
    });

    expect(onExpireMock).toHaveBeenCalledTimes(1);
  });

  it('resyncs target remaining seconds with server', async () => {
    let mockPerfNow = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => mockPerfNow);

    const onResyncMock = vi.fn().mockResolvedValue(500);

    const { result } = renderHook(() =>
      useServerTimer({ initialRemainingSeconds: 60, onResync: onResyncMock })
    );

    expect(result.current.remainingSeconds).toBe(60);

    await act(async () => {
      await result.current.resync();
    });

    expect(onResyncMock).toHaveBeenCalled();
    expect(result.current.remainingSeconds).toBe(500);
  });
});

