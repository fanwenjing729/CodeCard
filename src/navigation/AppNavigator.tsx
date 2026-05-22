import React from 'react';
import { Colors } from '@/theme';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import ErrorBoundary from '@/components/shared/ErrorBoundary';
import HomeScreen from '@/screens/HomeScreen';
import CourseScreen from '@/screens/CourseScreen';
import ModuleScreen from '@/screens/ModuleScreen';
import NodeScreen from '@/screens/NodeScreen';
import QuizScreen from '@/screens/QuizScreen';
import ProgressScreen from '@/screens/ProgressScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import LoginScreen from '@/screens/LoginScreen';
import WrongCardsScreen from '@/screens/WrongCardsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Course: { courseId: string };
  Module: { courseId: string; moduleId: string };
  Node: { courseId: string; nodeId: string };
  Quiz: { courseId: string; nodeId: string };
  Login: undefined;
  WrongCards: { courseId?: string } | undefined;
};

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 13 },
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopColor: Colors.tabBarBorder,
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
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="school" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: '进度',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trophy" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '设置',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          <RootStack.Screen name="Course" component={CourseScreen} />
          <RootStack.Screen name="Module" component={ModuleScreen} />
          <RootStack.Screen name="Node" component={NodeScreen} />
          <RootStack.Screen name="Quiz" component={QuizScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="WrongCards" component={WrongCardsScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
