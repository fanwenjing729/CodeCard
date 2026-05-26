import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Props {
  focused: boolean;
  color: string;
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  size: number;
}

export default function AnimatedTabIcon({ focused, color, name, size }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.2, { damping: 12, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Animated.View>
  );
}
