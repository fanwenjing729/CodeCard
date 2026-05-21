import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import CourseScreen from '../screens/CourseScreen';
import NodeScreen from '../screens/NodeScreen';
import QuizScreen from '../screens/QuizScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Course: { courseId: string };
  Node: { courseId: string; nodeId: string };
  Quiz: { courseId: string; nodeId: string };
};

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4a9eff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 13 },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
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
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen name="Course" component={CourseScreen} />
        <RootStack.Screen name="Node" component={NodeScreen} />
        <RootStack.Screen name="Quiz" component={QuizScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
