import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { useColors } from '@/theme/useTheme';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export default function Skeleton({ width = '100%', height = 20, borderRadius = 8 }: Props) {
  const C = useColors();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: C.progressBarBg },
        animStyle,
      ]}
    />
  );
}
