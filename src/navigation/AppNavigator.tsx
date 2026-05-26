import React, { useMemo } from 'react';
import { useTheme, useColors } from '@/theme';
import { Colors, DarkColors } from '@/theme/colors';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AnimatedTabIcon from '@/components/shared/AnimatedTabIcon';
import HomeScreen from '@/screens/HomeScreen';
import CourseScreen from '@/screens/CourseScreen';
import ModuleScreen from '@/screens/ModuleScreen';
import NodeScreen from '@/screens/NodeScreen';
import QuizScreen from '@/screens/QuizScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import LoginScreen from '@/screens/LoginScreen';
import WrongCardsScreen from '@/screens/WrongCardsScreen';
import DataScreen from '@/screens/DataScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Course: { courseId: string };
  Module: { courseId: string; moduleId: string };
  Node: { courseId: string; nodeId: string };
  Quiz: { courseId: string; nodeId: string };
  Login: undefined;
  WrongCards: { courseId?: string; moduleId?: string } | undefined;
  Data: undefined;
};

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const C = useColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.tabBarActive,
        tabBarInactiveTintColor: C.tabBarInactive,
        tabBarLabelStyle: { fontSize: 13 },
        tabBarStyle: {
          backgroundColor: C.bg,
          borderTopColor: C.tabBarBorder,
          height: 58,
          paddingTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Learn"
        component={HomeScreen}
        options={{
          tabBarLabel: '学习',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon focused={focused} color={color} name="school" size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: '进度',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon focused={focused} color={color} name="trophy" size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '设置',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon focused={focused} color={color} name="cog" size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isDark } = useTheme();

  const C = isDark ? DarkColors : Colors;

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: C.bg,
        card: C.bg,
        border: C.border,
      },
    };
  }, [isDark, C]);

  const screenBg = C.bg;

  return (
    <ErrorBoundary>
      <NavigationContainer theme={navigationTheme}>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: screenBg },
          }}
        >
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          <RootStack.Screen name="Course" component={CourseScreen} />
          <RootStack.Screen name="Module" component={ModuleScreen} />
          <RootStack.Screen name="Node" component={NodeScreen} />
          <RootStack.Screen name="Quiz" component={QuizScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="WrongCards" component={WrongCardsScreen} />
          <RootStack.Screen name="Data" component={DataScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
