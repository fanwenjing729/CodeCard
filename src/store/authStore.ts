import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

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

function toUser(phone?: string): User {
  return {
    id: phone ?? 'local',
    phone,
  };
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isMounted: false,

  initialize: async () => {
    // 监听登录状态变化（登录/登出/过期自动更新）
    supabase.auth.onAuthStateChange((_event, session) => {
      const phone = session?.user?.phone;
      set({
        user: phone ? toUser(phone) : null,
        isLoggedIn: session !== null,
      });
    });

    // 恢复上次登录状态
    const { data } = await supabase.auth.getSession();
    const phone = data.session?.user?.phone;
    set({
      user: phone ? toUser(phone) : null,
      isLoggedIn: data.session !== null,
      isMounted: true,
    });
  },

  loginByPhone: async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true },
    });
    return error ? { error: error.message } : {};
  },

  verifyOtp: async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) return { error: error.message };
    set({
      user: toUser(data.session?.user?.phone ?? phone),
      isLoggedIn: true,
    });
    return {};
  },

  loginByWechat: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'wechat' as any,
      options: { redirectTo: 'codecard://auth/callback', skipBrowserRedirect: true },
    });
    if (error) return { error: error.message };
    // OAuth 跳转后通过 onAuthStateChange 更新状态
    return {};
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isLoggedIn: false });
  },

  setDisplayId: (displayId) => {
    set((s) => ({
      user: s.user ? { ...s.user, displayId } : null,
    }));
  },
}));
