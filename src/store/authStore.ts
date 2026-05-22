import { create } from 'zustand';

export interface User {
  id: string;
  phone?: string;
  name?: string;
  avatar?: string;
  displayId?: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  isMounted: boolean;

  initialize: () => Promise<void>;
  loginByPhone: (phone: string) => Promise<{ error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error?: string }>;
  loginByWechat: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setDisplayId: (displayId: string) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isMounted: false,

  initialize: async () => {
    // no-op: 真实实现会从持久化存储恢复 session
    set({ isMounted: true });
  },

  loginByPhone: async () => {
    // no-op: 真实实现会调用 supabase.auth.signInWithOtp
    return { error: '登录功能即将上线' };
  },

  verifyOtp: async () => {
    // no-op: 真实实现会调用 supabase.auth.verifyOtp
    return { error: '登录功能即将上线' };
  },

  loginByWechat: async () => {
    // no-op: 真实实现会调用 supabase.auth.signInWithOAuth
    return { error: '登录功能即将上线' };
  },

  logout: async () => {
    // no-op: 真实实现会调用 supabase.auth.signOut + 清空状态
    set({ user: null, isLoggedIn: false });
  },

  setDisplayId: (displayId) => {
    set((s) => ({
      user: s.user ? { ...s.user, displayId } : null,
    }));
  },
}));
