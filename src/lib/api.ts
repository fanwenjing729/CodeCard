import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_PATH = '/api/v1';

function getBaseUrl(): string {
  // 生产环境：强制使用环境变量
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 开发环境：按平台自动选择
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:8080${API_PATH}`;
    }
    return `http://localhost:8080${API_PATH}`;
  }

  throw new Error(
    'EXPO_PUBLIC_API_URL must be set in production.\n' +
    'Example: EXPO_PUBLIC_API_URL=https://api.codecard.app/api/v1'
  );
}

const BASE_URL = getBaseUrl();

const ACCESS_KEY = 'codecard-access-token';
const REFRESH_KEY = 'codecard-refresh-token';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  AsyncStorage.setItem(ACCESS_KEY, access).catch(() => {});
  AsyncStorage.setItem(REFRESH_KEY, refresh).catch(() => {});
}

export async function loadTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const [a, r] = await Promise.all([
      AsyncStorage.getItem(ACCESS_KEY),
      AsyncStorage.getItem(REFRESH_KEY),
    ]);
    if (a && r) {
      accessToken = a;
      refreshToken = r;
      return { accessToken: a, refreshToken: r };
    }
  } catch {}
  return null;
}

export async function clearTokens() {
  accessToken = null;
  refreshToken = null;
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_KEY),
    AsyncStorage.removeItem(REFRESH_KEY),
  ]);
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        await clearTokens();
        return false;
      }
      const data = await res.json();
      setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function tryParseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (json.error) return json.error;
  } catch {}
  return text || res.statusText || 'request failed';
}

async function request<T = any>(method: string, path: string, body?: any): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retry = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!retry.ok) throw new ApiError(retry.status, await tryParseError(retry));
      return retry.headers.get('content-length') === '0' ? undefined as T : retry.json();
    }
    throw new ApiError(401, 'unauthorized');
  }

  if (!res.ok) throw new ApiError(res.status, await tryParseError(res));
  if (res.headers.get('content-length') === '0') return undefined as T;
  return res.json();
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function apiGet<T = any>(path: string): Promise<T> {
  return request<T>('GET', path);
}

export function apiPost<T = any>(path: string, body?: any): Promise<T> {
  return request<T>('POST', path, body);
}

export function apiPut<T = any>(path: string, body: any): Promise<T> {
  return request<T>('PUT', path, body);
}
