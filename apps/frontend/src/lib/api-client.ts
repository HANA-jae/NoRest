import { API_BASE_URL } from '@/config/constants';
import { useAuthStore } from '@/store/auth.store';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text() as unknown as T;
}

async function handleRefresh(): Promise<string | null> {
  const { refreshToken, setTokens, setUser, logout } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const json = await res.json();
    const data = json.data;
    setTokens(data.accessToken, data.refreshToken);
    if (data.user) {
      setUser(data.user);
    }
    return data.accessToken;
  } catch {
    logout();
    return null;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (!skipAuth) {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 401 → silent refresh 후 재시도
  if (response.status === 401 && !skipAuth) {
    const newToken = await handleRefresh();
    if (newToken) {
      requestHeaders['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!response.ok) {
    const errorData = await parseResponse(response).catch(() => null);
    let errorMessage = response.statusText;
    if (errorData && typeof errorData === 'object') {
      const body = errorData as Record<string, unknown>;
      const msg = body.message;
      if (Array.isArray(msg)) {
        errorMessage = msg.join(', ');
      } else if (typeof msg === 'string') {
        errorMessage = msg;
      }
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export { ApiError };
