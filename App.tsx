import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ThemeProvider } from '@/theme/ThemeContext';
import { useTheme, useColors } from '@/theme/useTheme';
import AppNavigator from '@/navigation/AppNavigator';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/authStore';
import { useAutoSync } from '@/hooks/useAutoSync';

// 阻止启动屏自动隐藏，等主题 + 字体 + 数据就绪后再手动隐藏
SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedApp() {
  const { isDark } = useTheme();
  const C = useColors();
  useAutoSync();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [initialDark, setInitialDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  // 读取主题偏好
  useEffect(() => {
    AsyncStorage.getItem('theme_mode').then((v) => {
      setInitialDark(v === 'dark');
    }).catch(() => {}).finally(() => {
      setThemeReady(true);
    });
  }, []);

  // 初始化 store
  useEffect(() => {
    useProgressStore.getState().hydrate().catch(() => {});
    useAuthStore.getState().initialize();
  }, []);

  const ready = fontsLoaded && themeReady;

  // 一切就绪后隐藏启动屏
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider initialDark={initialDark}>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
