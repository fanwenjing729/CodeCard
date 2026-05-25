import React from 'react';

const createMockComponent = (name: string) => {
  const Component = React.forwardRef((props: any, ref: any) =>
    React.createElement(name, { ...props, ref }),
  );
  Component.displayName = name;
  return Component;
};

const View = createMockComponent('View');
const Text = createMockComponent('Text');
const TextInput = createMockComponent('TextInput');
const ScrollView = createMockComponent('ScrollView');
const TouchableOpacity = createMockComponent('TouchableOpacity');
const FlatList = createMockComponent('FlatList');
const Modal = createMockComponent('Modal');
const ActivityIndicator = createMockComponent('ActivityIndicator');
const Pressable = createMockComponent('Pressable');
const Image = createMockComponent('Image');

export {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Pressable,
  Image,
};

export const StyleSheet = {
  create: (styles: Record<string, any>) => styles,
  hairlineWidth: 1,
  flatten: (style: any) => style,
};

export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios ?? obj.default,
};

export const Dimensions = {
  get: () => ({ width: 390, height: 844 }),
};

export const AppState = {
  addEventListener: () => ({ remove: () => {} }),
};

export const Animated = {
  View: createMockComponent('AnimatedView'),
  Text: createMockComponent('AnimatedText'),
  createAnimatedComponent: (c: any) => c,
  timing: () => ({ start: () => {} }),
  spring: () => ({ start: () => {} }),
};

export const UIManager = {
  getViewManagerConfig: () => null,
};

export const NativeModules = {};
export const requireNativeComponent = () => View;
export const DeviceEventEmitter = { addListener: () => ({ remove: () => {} }) };
export const PanResponder = { create: () => ({ panHandlers: {} }) };
export const Keyboard = { dismiss: () => {} };
export const KeyboardAvoidingView = createMockComponent('KeyboardAvoidingView');
export const StatusBar = createMockComponent('StatusBar');
export const SafeAreaView = createMockComponent('SafeAreaView');
export const useWindowDimensions = () => ({ width: 390, height: 844 });
export const useColorScheme = () => 'light';
