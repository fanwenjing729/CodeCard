import { useState, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * 手机号验证码登录的封装 hook。
 *
 * 用法：
 *   const { sendCode, verifyCode, countdown, sending, loading } = usePhoneAuth();
 *
 *   // 发送验证码
 *   await sendCode('+8613800138000');
 *
 *   // 验证验证码 → 登录
 *   const { error, isNewUser } = await verifyCode('+8613800138000', '123456');
 *
 * 屏幕只需关心 UI，hook 管理倒计时和 loading 状态。
 */
export function usePhoneAuth() {
  const sendPhoneOtp = useAuthStore((s) => s.sendPhoneOtp);
  const verifyPhoneOtp = useAuthStore((s) => s.verifyPhoneOtp);

  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  /** 发送短信验证码，自动开始 60 秒倒计时 */
  const sendCode = useCallback(
    async (phone: string): Promise<{ error?: string }> => {
      setSending(true);
      const { error } = await sendPhoneOtp(phone);
      setSending(false);
      if (!error) startCountdown();
      return { error };
    },
    [sendPhoneOtp, startCountdown],
  );

  /** 验证短信验证码，成功则自动登录 */
  const verifyCode = useCallback(
    async (
      phone: string,
      token: string,
    ): Promise<{ error?: string; isNewUser?: boolean }> => {
      setLoading(true);
      const result = await verifyPhoneOtp(phone, token);
      setLoading(false);
      return result;
    },
    [verifyPhoneOtp],
  );

  /** 手动停止倒计时（切换模式时用） */
  const clearCountdown = useCallback(() => {
    setCountdown(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return { sendCode, verifyCode, countdown, sending, loading, clearCountdown };
}
