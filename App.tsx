import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { useProgressStore } from './src/store/useProgressStore';

export default function App() {
  useEffect(() => {
    useProgressStore.getState().hydrate().catch(() => {
      // hydrate 内部已打印 warn，此处仅阻止 unhandled rejection
    });
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
