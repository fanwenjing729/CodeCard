import { useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useColors } from '@/theme/useTheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onFinish?: () => void;
}

interface ParticleData {
  id: number;
  x: number;
  delay: number;
  size: number;
  color: string;
  rotation: number;
}

function Particle({ x, delay: delayMs, size, color, rotation }: ParticleData) {
  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const t = setTimeout(() => {
      translateY.value = withTiming(SCREEN_HEIGHT + 50, { duration: 2000, easing: Easing.in(Easing.ease) });
      opacity.value = withDelay(1500, withTiming(0, { duration: 500 }));
    }, delayMs);
    return () => clearTimeout(t);
  }, [translateY, opacity, delayMs]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: translateY.value },
      { rotate: `${rotation}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        { position: 'absolute', top: 0, left: 0, width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    />
  );
}

export default function CelebrationOverlay({ visible, onFinish }: Props) {
  const C = useColors();

  useEffect(() => {
    if (visible && onFinish) {
      const t = setTimeout(onFinish, 2500);
      return () => clearTimeout(t);
    }
  }, [visible, onFinish]);

  const particles = useMemo(() => {
    if (!visible) return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      delay: Math.random() * 400,
      size: 8 + Math.random() * 16,
      color: ['#5B7FFF', '#34D399', '#F59E0B', '#EF4444', '#A78BFA'][i % 5],
      rotation: Math.random() * 360,
    }));
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { backgroundColor: C.backdrop }]}>
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
      <Animated.View style={styles.centerIcon}>
        <MaterialCommunityIcons name="party-popper" size={64} color="#F59E0B" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    zIndex: 1000,
  },
});
