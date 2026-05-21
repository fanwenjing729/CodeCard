import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AddressColumnProps {
  visible: boolean;
  rows: number;
  cols: number;
  cellSize: number;
  gap: number;
  baseAddress?: number;
}

export default function AddressColumn({
  visible,
  rows,
  cols,
  cellSize,
  gap,
  baseAddress = 0x1000,
}: AddressColumnProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-60);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.inOut(Easing.quad),
      });
      translateX.value = withTiming(0, {
        duration: 400,
        easing: Easing.inOut(Easing.quad),
      });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateX.value = withTiming(-60, { duration: 300 });
    }
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const addresses = Array.from({ length: rows }, (_, i) => {
    const addr = (baseAddress + i * cols)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0');
    return `0x${addr}`;
  });

  return (
    <Animated.View style={[styles.container, animStyle]}>
      {addresses.map((addr, i) => (
        <View
          key={i}
          style={[
            styles.row,
            { height: i < rows - 1 ? cellSize + gap : cellSize },
          ]}
        >
          <Text style={styles.text}>{addr}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 72,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  text: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
