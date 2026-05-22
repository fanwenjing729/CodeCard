import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/theme';
import type { LottieScenario } from '@/types';

interface Props {
  scenario: LottieScenario;
  step: number;
}

export default function LottiePlayer({ scenario, step }: Props) {
  const progress = scenario.totalSteps > 1
    ? step / (scenario.totalSteps - 1)
    : 0;

  useEffect(() => {
    // 加载 Lottie 文件并设置进度
    // 实际实现依赖 lottie-react-native，当前为骨架：
    // import LottieView from 'lottie-react-native';
    // animationRef.current?.play(startFrame, endFrame);
  }, [scenario.lottieFile]);

  return (
    <View style={styles.container}>
      {/* Lottie 动画组件占位 */}
      {/* 接入 lottie-react-native 后替换为： */}
      {/* <LottieView
            ref={animationRef}
            source={require(scenario.lottieFile)}
            progress={progress}
            style={styles.lottie}
          /> */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Lottie: {scenario.title}
        </Text>
        <Text style={styles.placeholderStep}>
          Step {step + 1} / {scenario.totalSteps}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  placeholderStep: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 8,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
