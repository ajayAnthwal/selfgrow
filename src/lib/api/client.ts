export interface ApiErrorDetail {
  code: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
}

export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public details?: any;

  constructor(message: string, status: number, code: string = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function executeTokenRefresh(): Promise<boolean> {
  try {
    const res = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return false;
    }

    const json = (await res.json()) as ApiResponse;
    return json.success === true;
  } catch {
    return false;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuthRefresh?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, skipAuthRefresh = false, headers, ...customConfig } = options;

  let url = endpoint.startsWith('http') || endpoint.startsWith('/api')
    ? endpoint
    : `/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...(headers as Record<string, string>),
    },
    ...customConfig,
  };

  let response: Response;

  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiClientError(
      err.message || 'Network connection failed',
      0,
      'NETWORK_ERROR'
    );
  }

  // Handle 401 Unauthorized with single shared in-flight refresh attempt
  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    !url.includes('/auth/login') &&
    !url.includes('/auth/refresh')
  ) {
    if (!refreshPromise) {
      refreshPromise = executeTokenRefresh().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (refreshed) {
      // Retry the original request with refreshed tokens (via httpOnly cookie)
      return apiClient<T>(endpoint, {
        ...options,
        skipAuthRefresh: true, // Prevent infinite loops
      });
    } else {
      // Session has truly expired - only redirect if on a protected route
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        const path = window.location.pathname;
        const isPublic =
          path === '/' ||
          path === '/en' ||
          path === '/hi' ||
          path.includes('/products') ||
          path.includes('/terms') ||
          path.includes('/privacy') ||
          path.includes('/contact');

        if (!isPublic) {
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?redirect=${returnUrl}`;
        }
      }
    }
  }

  let body: ApiResponse<T>;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      body = await response.json();
    } catch {
      throw new ApiClientError(
        'Failed to parse JSON response from server',
        response.status,
        'INVALID_RESPONSE'
      );
    }
  } else {
    if (!response.ok) {
      throw new ApiClientError(
        `Server returned error ${response.status}`,
        response.status,
        'SERVER_ERROR'
      );
    }
    return (await response.text()) as unknown as T;
  }

  if (!response.ok || !body.success) {
    const errorInfo = body.error || {
      code: 'API_ERROR',
      message: `Request failed with status ${response.status}`,
    };
    throw new ApiClientError(
      errorInfo.message,
      response.status,
      errorInfo.code,
      body
    );
  }

  return body.data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
};

