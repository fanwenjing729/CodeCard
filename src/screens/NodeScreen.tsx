import { useRef, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { Colors, useColors, FontFamily } from '@/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';
import renderCard from '@/components/cards/renderCard';
import { useProgressStore } from '@/store/useProgressStore';
import { useNodeScreen } from './useNodeScreen';
import { useCourse } from '@/lib/useCourses';

type Props = NativeStackScreenProps<RootStackParamList, 'Node'>;

const ANIM_DURATION = 250;

export default function NodeScreen({ route, navigation }: Props) {
  const { courseId, nodeId } = route.params;
  const savedIndex = useProgressStore(
    (s) => s.courses[courseId]?.nodePositions[nodeId] ?? 0,
  );
  const C = useColors();

  const course = useCourse(courseId);

  useLayoutEffect(() => {
    navigation.setOptions({ contentStyle: { backgroundColor: C.bg } });
  }, [navigation, C.bg]);
  if (!course) {
    return (
      <View style={[styles.empty, { backgroundColor: C.bg }]}>
        <Text style={[styles.emptyText, { color: C.textMuted }]}>课程未找到</Text>
      </View>
    );
  }

  const node = course.nodes.find((n) => n.id === nodeId);
  if (!node) {
    console.warn(`[NodeScreen] 节点未找到: nodeId="${nodeId}" courseId="${courseId}"`);
    return (
      <View style={[styles.empty, { backgroundColor: C.bg }]}>
        <Text style={[styles.emptyText, { color: C.textMuted }]}>节点未找到</Text>
      </View>
    );
  }

  const cards = node.cards;

  const {
    card,
    index,
    animStep,
    isLast,
    advance,
    previous,
    handlePracticeComplete,
    handlePracticeNext,
    handlePracticeStateChange,
    practiceStates,
    getAnimTotalSteps,
    isContinuous,
  } = useNodeScreen({ courseId, nodeId, cards, savedIndex, navigation });

  if (!card) {
    return (
      <View style={[styles.empty, { backgroundColor: C.bg }]}>
        <Text style={[styles.emptyText, { color: C.textMuted }]}>暂无卡片</Text>
      </View>
    );
  }

  const totalAnimSteps = getAnimTotalSteps();

  // 追踪切换方向
  const directionRef = useRef<'forward' | 'backward'>('forward');

  const handleAdvance = useCallback(() => {
    directionRef.current = 'forward';
    advance();
  }, [advance]);

  const handlePrevious = useCallback(() => {
    directionRef.current = 'backward';
    previous();
  }, [previous]);

  // 动画方向
  const entering = directionRef.current === 'forward'
    ? FadeInRight.duration(ANIM_DURATION)
    : FadeInLeft.duration(ANIM_DURATION);
  const exiting = directionRef.current === 'forward'
    ? FadeOutLeft.duration(ANIM_DURATION)
    : FadeOutRight.duration(ANIM_DURATION);

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel="返回"
        center={<Text style={[styles.module, { color: C.textSecondary }]}>{node.module}</Text>}
        right={<Text style={[styles.progress, { color: C.textMuted }]}>{index + 1} / {cards.length}</Text>}
        variant="compact"
      />

      <Animated.View
        key={index}
        entering={entering}
        exiting={exiting}
        style={styles.cardArea}
      >
        {renderCard({
          card,
          animStep,
          onPracticeComplete: handlePracticeComplete,
          onPracticeNext: handlePracticeNext,
          isLast,
          practiceState: practiceStates.current.get(card.id),
          onPracticeStateChange: (s) => handlePracticeStateChange(card.id, s),
        })}
      </Animated.View>

      <View style={[styles.footer, { borderTopColor: C.border }]}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.prevBtn, index === 0 && styles.navBtnDisabled, { backgroundColor: C.disabledBg }]}
            onPress={handlePrevious}
            disabled={index === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>← 上一张</Text>
          </TouchableOpacity>
          {card.cardType !== 'practice' && (
            <TouchableOpacity
              style={[
                styles.nextBtn,
                { backgroundColor: (isLast && animStep >= totalAnimSteps - 1) ? C.success : C.primary },
                isLast && animStep >= totalAnimSteps - 1 && styles.nextBtnDone,
              ]}
              onPress={handleAdvance}
              activeOpacity={0.7}
            >
              <Text style={styles.navText}>
                {isContinuous
                  ? (isLast ? '完成' : '下一张')
                  : card.cardType === 'animation' && animStep < totalAnimSteps - 1
                    ? `下一步 ${animStep + 1}/${totalAnimSteps}`
                    : isLast
                      ? '完成'
                      : '下一张'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  cardArea: {
    flex: 1,
  },
  module: {
    fontFamily: FontFamily.sansBold,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progress: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prevBtn: {
    flex: 1,
    backgroundColor: Colors.disabledBg,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnDone: {
    backgroundColor: Colors.success,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navText: {
    fontFamily: FontFamily.sansBold,
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
