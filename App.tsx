import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from '@/navigation/AppNavigator';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  useEffect(() => {
    useProgressStore.getState().hydrate().catch(() => {
      // hydrate 内部已打印 warn，此处仅阻止 unhandled rejection
    });
    useAuthStore.getState().initialize();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
