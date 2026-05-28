import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost, apiGet, apiPut, loadTokens, setTokens, clearTokens, getRefreshToken } from '@/lib/api';
import { syncOnLogin } from './syncEngine';

export interface User {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  avatar?: string;
  displayId?: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  isMounted: boolean;

  initialize: () => Promise<void>;
  loginByEmail: (email: string, password: string) => Promise<{ error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ error?: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error?: string }>;
  sendPhoneOtp: (phone: string) => Promise<{ error?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error?: string; isNewUser?: boolean }>;
  registerByEmail: (email: string, password: string) => Promise<{ error?: string; info?: string }>;
  setPassword: (password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setDisplayId: (displayId: string) => Promise<void>;
  updateAvatar: (uri: string) => void;
}

const AVATAR_KEY = 'codecard-avatar';

interface ApiUser {
  id: string;
  email?: string;
  phone?: string;
  displayId?: string;
  avatarUrl?: string;
}

function toUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    phone: apiUser.phone,
    name: undefined,
    avatar: apiUser.avatarUrl,
    displayId: apiUser.displayId,
  };
}

let _initialized = false;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isMounted: false,

  initialize: async () => {
    const tokens = await loadTokens();
    if (!tokens) {
      set({ isMounted: true });
      return;
    }

    try {
      const profile: ApiUser = await apiGet('/auth/me');
      let user = toUser(profile);

      // 恢复本地头像
      if (!user.avatar) {
        try {
          const localAvatar = await AsyncStorage.getItem(AVATAR_KEY);
          if (localAvatar) user = { ...user, avatar: localAvatar };
        } catch {}
      }

      set({
        user,
        isLoggedIn: true,
        isMounted: true,
      });

      syncOnLogin(profile.id).catch(() => {});
    } catch {
      await clearTokens();
      set({ isMounted: true });
    }
    _initialized = true;
  },

  loginByEmail: async (email: string, password: string) => {
    try {
      const data = await apiPost<any>('/auth/login', { email, password });
      setTokens(data.accessToken, data.refreshToken);
      set({
        user: toUser(data.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.user.id).catch(() => {});
      return {};
    } catch (e: any) {
      const msg = e.status === 401 ? '邮箱或密码错误' : (e.message || '登录失败');
      return { error: msg };
    }
  },

  sendEmailOtp: async (email: string) => {
    try {
      await apiPost('/auth/send-otp', { target: email, purpose: 'login' });
      return {};
    } catch (e: any) {
      return { error: e.message || '发送失败' };
    }
  },

  verifyEmailOtp: async (email: string, token: string) => {
    try {
      const data = await apiPost<any>('/auth/verify-otp', { target: email, code: token, purpose: 'login' });
      setTokens(data.accessToken, data.refreshToken);
      set({
        user: toUser(data.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.user.id).catch(() => {});
      return {};
    } catch (e: any) {
      return { error: e.message || '验证失败' };
    }
  },

  sendPhoneOtp: async (phone: string) => {
    try {
      await apiPost('/auth/send-otp', { target: phone, purpose: 'login' });
      return {};
    } catch (e: any) {
      return { error: e.message || '发送失败' };
    }
  },

  verifyPhoneOtp: async (phone: string, token: string) => {
    try {
      const data = await apiPost<any>('/auth/verify-otp', { target: phone, code: token, purpose: 'login' });
      setTokens(data.accessToken, data.refreshToken);
      set({
        user: toUser(data.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.user.id).catch(() => {});
      return { isNewUser: data.isNewUser ?? false };
    } catch (e: any) {
      return { error: e.message || '验证失败' };
    }
  },

  registerByEmail: async (email: string, password: string) => {
    try {
      const data = await apiPost<any>('/auth/register', { email, password });
      setTokens(data.accessToken, data.refreshToken);
      set({
        user: toUser(data.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.user.id).catch(() => {});
      return {};
    } catch (e: any) {
      return { error: e.message || '注册失败' };
    }
  },

  setPassword: async (password: string) => {
    try {
      await apiPost('/auth/set-password', { password });
      return {};
    } catch (e: any) {
      return { error: e.message || '修改失败' };
    }
  },

  logout: async () => {
    const rt = getRefreshToken();
    try {
      await apiPost('/auth/logout', { refreshToken: rt });
    } catch {}
    await clearTokens();
    set({ user: null, isLoggedIn: false });
  },

  setDisplayId: async (displayId) => {
    set((s) => ({
      user: s.user ? { ...s.user, displayId } : null,
    }));
    try {
      await apiPut('/auth/profile', { displayId });
    } catch {}
  },

  updateAvatar: (uri) => {
    set((s) => ({
      user: s.user ? { ...s.user, avatar: uri } : null,
    }));
    AsyncStorage.setItem(AVATAR_KEY, uri).catch(() => {});
  },
}));
