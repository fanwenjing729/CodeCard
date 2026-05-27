import { useEffect, useRef } from 'react';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/authStore';
import { uploadProgress } from '@/store/syncEngine';

export function useAutoSync() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = useProgressStore.subscribe(() => {
      const uid = useAuthStore.getState().user?.id;
      if (!uid) return;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        uploadProgress(uid).catch(() => {});
      }, 3000);
    });

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
}
