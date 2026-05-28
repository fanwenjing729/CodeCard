import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  sendPhoneOtp: (phone: string) => Promise<{ error?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error?: string; isNewUser?: boolean }>;
  registerByEmail: (email: string, password: string) => Promise<{ error?: string; info?: string }>;
  setPassword: (password: string) => Promise<{ error?: string }>;
  // loginByWechat: () => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setDisplayId: (displayId: string) => Promise<void>;
  updateAvatar: (uri: string) => void;
}

const AVATAR_KEY = 'codecard-avatar';

function toUser(user: { id: string; email?: string; phone?: string; user_metadata?: Record<string, any> }): User {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.user_metadata?.full_name,
    avatar: user.user_metadata?.avatar_url,
    displayId: user.user_metadata?.displayId,
  };
}

let _unsubscribeAuth: (() => void) | null = null;
let _initialized = false;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoggedIn: false,
  isMounted: false,

  initialize: async () => {
    if (_unsubscribeAuth) _unsubscribeAuth();

    const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
      set({
        user: session?.user ? toUser(session.user) : null,
        isLoggedIn: session !== null,
      });
      // 仅新登录（非初始化恢复）时触发同步
      // 初始化恢复的同步在下方 getSession 中处理
      if (event === 'SIGNED_IN' && _initialized) {
        if (session?.user) syncOnLogin(session.user.id).catch(() => {});
      }
    });
    _unsubscribeAuth = authData.subscription.unsubscribe;

    const { data } = await supabase.auth.getSession();
    const hasSession = data.session !== null;
    let user = data.session?.user ? toUser(data.session.user) : null;

    // 从 AsyncStorage 恢复本地头像（user_metadata 无头像时兜底）
    if (user && !user.avatar) {
      try {
        const localAvatar = await AsyncStorage.getItem(AVATAR_KEY);
        if (localAvatar) user = { ...user, avatar: localAvatar };
      } catch {}
    }

    set({
      user,
      isLoggedIn: hasSession,
      isMounted: true,
    });

    if (hasSession && data.session?.user) {
      syncOnLogin(data.session.user.id).catch(() => {});
    }
    _initialized = true;
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

  sendPhoneOtp: async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: { shouldCreateUser: true },
    });
    return error ? { error: error.message } : {};
  },

  verifyPhoneOtp: async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) return { error: error.message };
    if (data.session?.user) {
      const u = data.session.user;
      const isNewUser = Math.abs(
        new Date(u.created_at ?? '').getTime() - new Date(u.updated_at ?? '').getTime(),
      ) < 1000;
      set({
        user: toUser(u),
        isLoggedIn: true,
      });
      syncOnLogin(u.id).catch(() => {});
      return { isNewUser };
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
    // 邮箱确认已开启 → 提示查收邮件
    if (!data.session) {
      return { info: '注册成功！请查收验证邮件并点击确认链接，然后返回登录。' };
    }
    // 邮箱确认未开启 → 直接登录
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

  setDisplayId: async (displayId) => {
    set((s) => ({
      user: s.user ? { ...s.user, displayId } : null,
    }));
    supabase.auth.updateUser({ data: { displayId } }).catch(() => {});
  },

  updateAvatar: (uri) => {
    set((s) => ({
      user: s.user ? { ...s.user, avatar: uri } : null,
    }));
    AsyncStorage.setItem(AVATAR_KEY, uri).catch(() => {});
  },
}));
