import type { ApiResponse, AuthResult, User, TradeSignal, CreateTradeSignalInput, Discussion, CreateDiscussionInput, CreateCommentInput } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function clearAuthStorage(): void {
  clearTokens();
  if (typeof window !== 'undefined') localStorage.removeItem('user');
}

let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;

async function doRefresh(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success || !json.data) return null;
    const { accessToken, refreshToken: newRefresh } = json.data;
    if (!accessToken || !newRefresh) return null;
    return { accessToken, refreshToken: newRefresh };
  } catch {
    return null;
  }
}

export interface AuthenticatedFetchOptions extends RequestInit {
  /** When true, do not clear storage or redirect on refresh failure; caller will show error. Use for upload so user stays on page. */
  skipGlobalLogout?: boolean;
}

/** Authenticated fetch with refresh-on-401. Use for FormData/uploads (no Content-Type override). */
export async function authenticatedFetch(
  path: string,
  options: AuthenticatedFetchOptions = {}
): Promise<Response> {
  const { skipGlobalLogout, ...fetchOptions } = options;
  const token = getToken();
  const headers: HeadersInit = { ...options.headers };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  } catch (err) {
    throw err;
  }
  if (res.status === 401) {
    if (!refreshPromise) refreshPromise = doRefresh();
    const tokens = await refreshPromise;
    refreshPromise = null;
    if (tokens) {
      setTokens(tokens.accessToken, tokens.refreshToken);
      const canRetryBody = fetchOptions.body == null || typeof fetchOptions.body === 'string';
      if (canRetryBody) {
        const retryHeaders: HeadersInit = { ...options.headers, Authorization: `Bearer ${tokens.accessToken}` };
        res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers: retryHeaders });
      }
    } else {
      if (!skipGlobalLogout) {
        clearAuthStorage();
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
  }
  return res;
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Network error',
      error: undefined,
    };
  }

  if (res.status === 401) {
    if (!refreshPromise) refreshPromise = doRefresh();
    const tokens = await refreshPromise;
    refreshPromise = null;
    if (tokens) {
      setTokens(tokens.accessToken, tokens.refreshToken);
      const newHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      };
      const retry = await fetch(`${API_URL}${path}`, { ...options, headers: newHeaders });
      const retryJson = await retry.json().catch(() => ({ success: false, message: 'Invalid response' }));
      if (!retry.ok) {
        return {
          success: false,
          message: retryJson.message ?? `Request failed (${retry.status})`,
          error: retryJson.error,
        };
      }
      return retryJson as ApiResponse<T>;
    }
    clearAuthStorage();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('auth:logout'));
    const json = await res.json().catch(() => ({}));
    return {
      success: false,
      message: json.message ?? 'Session expired',
      error: json.error,
    };
  }

  const json = await res.json().catch(() => ({ success: false, message: 'Invalid response' }));

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? `Request failed (${res.status})`,
      error: json.error,
    };
  }
  return json as ApiResponse<T>;
}

export const authApi = {
  register: (body: { email: string; password: string; name?: string; role?: string }) =>
    api<AuthResult>('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    api<AuthResult>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

export const userApi = {
  getMe: () => api<User>('/api/v1/users/me'),
  updateMe: (body: { name?: string }) =>
    api<User>('/api/v1/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
};

export const tradeSignalApi = {
  getPublic: () => api<TradeSignal[]>('/api/v1/trade-signals/public'),
  getMine: () => api<TradeSignal[]>('/api/v1/trade-signals'),
  getAllAdmin: () => api<TradeSignal[]>('/api/v1/trade-signals/admin'),
  getById: (id: string) => api<TradeSignal>(`/api/v1/trade-signals/${id}`),
  create: (body: CreateTradeSignalInput) =>
    api<TradeSignal>('/api/v1/trade-signals', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CreateTradeSignalInput>) =>
    api<TradeSignal>(`/api/v1/trade-signals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateStatus: (id: string, status: 'approved' | 'rejected') =>
    api<TradeSignal>(`/api/v1/trade-signals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) =>
    api<{ deleted: boolean }>(`/api/v1/trade-signals/${id}`, { method: 'DELETE' }),
};

export const discussionApi = {
  getAll: () => api<Discussion[]>('/api/v1/discussions'),
  getById: (id: string) => api<Discussion>(`/api/v1/discussions/${id}`),
  create: (body: CreateDiscussionInput) =>
    api<Discussion>('/api/v1/discussions', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<CreateDiscussionInput>) =>
    api<Discussion>(`/api/v1/discussions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) =>
    api<{ deleted: boolean }>(`/api/v1/discussions/${id}`, { method: 'DELETE' }),
  addComment: (discussionId: string, body: CreateCommentInput) =>
    api<Discussion>(`/api/v1/discussions/${discussionId}/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  deleteComment: (discussionId: string, commentId: string) =>
    api<Discussion>(`/api/v1/discussions/${discussionId}/comments/${commentId}`, {
      method: 'DELETE',
    }),
};
