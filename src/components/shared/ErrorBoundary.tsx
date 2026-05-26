import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, DarkColors } from '@/theme';
import { ThemeContext } from '@/theme/ThemeContext';
import type { ReactNode } from 'react';
import { useProgressStore } from '@/store/useProgressStore';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundaryInner extends React.Component<Props & { colors: Record<string, string> }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[CodeCard] ErrorBoundary caught:', error);
    try {
      useProgressStore.getState().flush();
    } catch (flushError) {
      console.error('[CodeCard] ErrorBoundary flush failed:', flushError);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const C = this.props.colors;
      return (
        <View style={[styles.container, { backgroundColor: C.bg }]}>
          <Text style={[styles.title, { color: C.optionText }]}>出错了</Text>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>应用遇到了意外错误，学习进度已保存</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: C.primary }]} onPress={this.handleRetry}>
            <Text style={[styles.buttonText, { color: C.textInverse }]}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children as ReactNode;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.optionText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function ErrorBoundary({ children }: Props) {
  return (
    <ThemeContext.Consumer>
      {({ isDark }) => (
        <ErrorBoundaryInner colors={isDark ? DarkColors : Colors}>
          {children}
        </ErrorBoundaryInner>
      )}
    </ThemeContext.Consumer>
  );
}
