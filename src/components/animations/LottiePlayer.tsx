import { useRef, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '@/theme';
import type { LottieScenario } from '@/types';

interface Props {
  scenario: LottieScenario;
  step: number;
}

export default function LottiePlayer({ scenario }: Props) {
  const ref = useRef<LottieView>(null);

  useEffect(() => {
    ref.current?.play();
  }, []);

  if (!scenario.source) {
    return (
      <View style={styles.container}>
        <Text style={styles.caption}>{scenario.title || '动画资源未配置'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LottieView
        ref={ref}
        source={scenario.source}
        autoPlay
        loop={scenario.loop ?? true}
        style={styles.lottie}
        resizeMode="contain"
      />
      {scenario.title && (
        <Text style={styles.caption}>{scenario.title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: '70%',
  },
  caption: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 12,
  },
});
