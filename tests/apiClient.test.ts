import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, ApiClientError } from '../src/lib/api/client';

describe('apiClient', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('unwraps successful API response data', async () => {
    const mockData = { user: { id: 'usr_1', email: 'test@example.com' } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, data: mockData }),
    });

    const result = await apiClient<{ user: { id: string } }>('/auth/me');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('throws ApiClientError with backend error code on 400', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Wrong password' },
      }),
    });

    await expect(apiClient('/auth/login', { method: 'POST' })).rejects.toThrow(
      ApiClientError
    );

    try {
      await apiClient('/auth/login', { method: 'POST' });
    } catch (err: any) {
      expect(err.status).toBe(400);
      expect(err.code).toBe('INVALID_CREDENTIALS');
      expect(err.message).toBe('Wrong password');
    }
  });

  it('attempts token refresh on 401 and retries original request', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(async (url: string) => {
      callCount++;
      if (url.includes('/api/v1/auth/refresh')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true, data: { message: 'Refreshed' } }),
        };
      }

      if (callCount === 1) {
        // First call to /auth/me returns 401
        return {
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Token expired' },
          }),
        };
      }

      // Retry call returns 200
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          data: { user: { id: 'usr_123' } },
        }),
      };
    });

    const result = await apiClient<{ user: { id: string } }>('/auth/me');
    expect(result).toEqual({ user: { id: 'usr_123' } });
    // 1st request -> 401, 2nd request -> refresh, 3rd request -> retry
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});

