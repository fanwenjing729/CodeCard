import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import type { VarAlloc } from '@/types';

interface VarLabelProps {
  alloc: VarAlloc;
  index: number;
  cellSize: number;
  gap: number;
  cols: number;
  startByte: number;
}

export default function VarLabel({
  alloc,
  index,
  cellSize,
  gap,
  cols,
  startByte,
}: VarLabelProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 8;

    const delay = index * 200 + 100;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) }),
    );
  }, [index]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const col = startByte % cols;
  const left = col * (cellSize + gap);
  const width = alloc.typeSize * (cellSize + gap) - gap;

  return (
    <Animated.View style={[styles.container, animStyle, { left, width }]}>
      <Text style={styles.name}>{alloc.name}</Text>
      <Text style={styles.meta}>
        {alloc.type} ({alloc.typeSize}B)
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -44,
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  meta: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
  },
});
