import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';
import renderCard from '@/components/cards/renderCard';
import { useProgressStore } from '@/store/useProgressStore';
import { useNodeScreen } from './useNodeScreen';
import { useCourse } from '@/lib/useCourses';

type Props = NativeStackScreenProps<RootStackParamList, 'Node'>;

export default function NodeScreen({ route, navigation }: Props) {
  const { courseId, nodeId } = route.params;
  const savedIndex = useProgressStore(
    (s) => s.courses[courseId]?.nodePositions[nodeId] ?? 0,
  );

  const course = useCourse(courseId);
  if (!course) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>课程未找到</Text>
      </View>
    );
  }

  const node = course.nodes.find((n) => n.id === nodeId);
  if (!node) {
    console.warn(`[NodeScreen] 节点未找到: nodeId="${nodeId}" courseId="${courseId}"`);
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>节点未找到</Text>
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
  } = useNodeScreen({ courseId, nodeId, cards, savedIndex, navigation });

  if (!card) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>暂无卡片</Text>
      </View>
    );
  }

  const totalAnimSteps = getAnimTotalSteps();

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel="返回"
        center={<Text style={styles.module}>{node.module}</Text>}
        right={<Text style={styles.progress}>{index + 1} / {cards.length}</Text>}
        variant="compact"
      />

      <View style={styles.cardArea}>
        {renderCard({
          card,
          animStep,
          onPracticeComplete: handlePracticeComplete,
          onPracticeNext: handlePracticeNext,
          isLast,
          practiceState: practiceStates.current.get(card.id),
          onPracticeStateChange: (s) => handlePracticeStateChange(card.id, s),
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.prevBtn, index === 0 && styles.navBtnDisabled]}
            onPress={previous}
            disabled={index === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>← 上一张</Text>
          </TouchableOpacity>
          {card.cardType !== 'practice' && (
            <TouchableOpacity
              style={[
                styles.nextBtn,
                isLast && animStep >= totalAnimSteps - 1 && styles.nextBtnDone,
              ]}
              onPress={advance}
              activeOpacity={0.7}
            >
              <Text style={styles.navText}>
                {card.cardType === 'animation' && animStep < totalAnimSteps - 1
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
