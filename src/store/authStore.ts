import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
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
  registerByEmail: (email: string, password: string) => Promise<{ error?: string }>;
  setPassword: (password: string) => Promise<{ error?: string }>;
  // loginByWechat: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setDisplayId: (displayId: string) => void;
}

function toUser(user: { id: string; email?: string; phone?: string; user_metadata?: Record<string, any> }): User {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.user_metadata?.full_name,
    avatar: user.user_metadata?.avatar_url,
  };
}

let _unsubscribeAuth: (() => void) | null = null;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isMounted: false,

  initialize: async () => {
    // 清理上次注册的监听器
    if (_unsubscribeAuth) _unsubscribeAuth();

    // 监听登录状态变化（登录/登出/过期自动更新）
    const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
      set({
        user: session?.user ? toUser(session.user) : null,
        isLoggedIn: session !== null,
      });
      if (event === 'SIGNED_IN' && session?.user) {
        syncOnLogin(session.user.id).catch(() => {});
      }
    });
    _unsubscribeAuth = authData.subscription.unsubscribe;

    // 恢复上次登录状态
    const { data } = await supabase.auth.getSession();
    set({
      user: data.session?.user ? toUser(data.session.user) : null,
      isLoggedIn: data.session !== null,
      isMounted: true,
    });
  },

  loginByEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      const msg = error.message.includes('Invalid login credentials')
        ? '邮箱或密码错误'
        : error.message;
      return { error: msg };
    }
    if (data.session?.user) {
      set({
        user: toUser(data.session.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.session.user.id).catch(() => {});
    }
    return {};
  },

  sendEmailOtp: async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return error ? { error: error.message } : {};
  },

  verifyEmailOtp: async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) return { error: error.message };
    if (data.session?.user) {
      set({
        user: toUser(data.session.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.session.user.id).catch(() => {});
    }
    return {};
  },

  registerByEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      if (error.message.includes('already registered')) {
        return { error: '该账号已存在' };
      }
      return { error: error.message };
    }
    if (data.session?.user) {
      set({
        user: toUser(data.session.user),
        isLoggedIn: true,
      });
      syncOnLogin(data.session.user.id).catch(() => {});
    }
    return {};
  },

  setPassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: error.message } : {};
  },

  // loginByWechat: async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'wechat' as any,
  //     options: { redirectTo: 'codecard://auth/callback', skipBrowserRedirect: true },
  //   });
  //   if (error) return { error: error.message };
  //   return {};
  // },

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
