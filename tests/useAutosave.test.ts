import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutosave } from '../src/features/assessment/hooks/useAutosave';
import { api } from '../src/lib/api/client';

describe('useAutosave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('saves choice questions immediately without debounce', async () => {
    const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ savedCount: 1 });

    const { result } = renderHook(() =>
      useAutosave({ attemptId: 'att_123', debounceMs: 600 })
    );

    await act(async () => {
      result.current.recordAnswer(
        { questionId: 'q_1', selectedOptionIds: ['opt_a'] },
        false // immediate
      );
      await vi.runAllTimersAsync();
    });

    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenCalledWith('/attempts/att_123/answers', {
      answers: [{ questionId: 'q_1', selectedOptionIds: ['opt_a'] }],
    });
    expect(result.current.status).toBe('saved');
    expect(result.current.pendingCount).toBe(0);
  });

  it('debounces text responses and batches multiple keystrokes', async () => {
    const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ savedCount: 1 });

    const { result } = renderHook(() =>
      useAutosave({ attemptId: 'att_123', debounceMs: 600 })
    );

    act(() => {
      result.current.recordAnswer(
        { questionId: 'q_text', textAnswer: 'Hel' },
        true // debounced
      );
    });

    // Not called immediately
    expect(putSpy).not.toHaveBeenCalled();
    expect(result.current.status).toBe('saving');

    // User types more before 600ms
    act(() => {
      vi.advanceTimersByTime(200);
      result.current.recordAnswer(
        { questionId: 'q_text', textAnswer: 'Hello World' },
        true
      );
    });

    expect(putSpy).not.toHaveBeenCalled();

    // Fast forward remaining debounce time
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenCalledWith('/attempts/att_123/answers', {
      answers: [{ questionId: 'q_text', textAnswer: 'Hello World' }],
    });
    expect(result.current.status).toBe('saved');
  });

  it('batches pending answers across multiple questions', async () => {
    const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ savedCount: 2 });

    const { result } = renderHook(() =>
      useAutosave({ attemptId: 'att_123', debounceMs: 600 })
    );

    act(() => {
      result.current.recordAnswer(
        { questionId: 'q_1', textAnswer: 'Answer 1' },
        true
      );
      result.current.recordAnswer(
        { questionId: 'q_2', textAnswer: 'Answer 2' },
        true
      );
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(putSpy).toHaveBeenCalledTimes(1);
    const sentAnswers = putSpy.mock.calls[0][1] as any;
    expect(sentAnswers.answers).toHaveLength(2);
    expect(result.current.status).toBe('saved');
  });

  it('flush() immediately executes pending save and returns promise', async () => {
    const putSpy = vi.spyOn(api, 'put').mockResolvedValue({ savedCount: 1 });

    const { result } = renderHook(() =>
      useAutosave({ attemptId: 'att_123', debounceMs: 600 })
    );

    act(() => {
      result.current.recordAnswer(
        { questionId: 'q_1', textAnswer: 'Fast save' },
        true
      );
    });

    expect(putSpy).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.flush();
    });

    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('saved');
  });

  it('retries with backoff on network failure', async () => {
    const putSpy = vi
      .spyOn(api, 'put')
      .mockRejectedValueOnce({ name: 'TypeError', message: 'Failed to fetch' })
      .mockResolvedValueOnce({ savedCount: 1 });

    const { result } = renderHook(() =>
      useAutosave({ attemptId: 'att_123', debounceMs: 600 })
    );

    await act(async () => {
      result.current.recordAnswer(
        { questionId: 'q_1', selectedOptionIds: ['opt_1'] },
        false
      );
      // Wait for initial failure
      await vi.advanceTimersByTimeAsync(10);
    });

    // First call failed -> offline status
    expect(result.current.status).toBe('offline');

    // Advance 1000ms for first retry
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });

    expect(putSpy).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('saved');
  });
});
