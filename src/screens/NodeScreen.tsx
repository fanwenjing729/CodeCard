import { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { courses } from '@/data/courses';
import { getAnimScenario } from '@/data/animations';
import renderCard from '@/components/cards/renderCard';
import { useProgressStore, XP_PER_CARD, XP_PER_PRACTICE } from '@/store/useProgressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Node'>;

export default function NodeScreen({ route, navigation }: Props) {
  const { courseId, nodeId } = route.params;
  const rewardCard = useProgressStore((s) => s.rewardCard);
  const setNodePosition = useProgressStore((s) => s.setNodePosition);
  const savedIndex = useProgressStore(
    (s) => s.courses[courseId]?.nodePositions[nodeId] ?? 0,
  );

  const course = courses.find((c) => c.id === courseId);
  const node = course?.nodes.find((n) => n.id === nodeId);
  const cards = node?.cards ?? [];

  const [index, setIndex] = useState(savedIndex);
  const [done, setDone] = useState(false);
  const [animStep, setAnimStep] = useState(0);

  const indexRef = useRef(index);
  indexRef.current = index;
  const doneRef = useRef(done);
  doneRef.current = done;
  const cardRef = useRef(cards[index]);
  cardRef.current = cards[index];

  const card = cards[index];
  const isLast = index === cards.length - 1;

  useEffect(() => {
    setAnimStep(0);
  }, [card?.id]);

  // 退出时用 ref 读最新值，避免陈旧闭包
  useEffect(() => {
    return () => {
      if (!doneRef.current) {
        setNodePosition(courseId, nodeId, indexRef.current);
      }
    };
  }, [courseId, nodeId, setNodePosition]);

  const savePosition = useCallback(
    (i: number) => {
      setNodePosition(courseId, nodeId, i);
    },
    [courseId, nodeId, setNodePosition],
  );

  const getAnimTotalSteps = (): number => {
    if (!card || card.cardType !== 'animation') return 1;
    const scenario = getAnimScenario(card.content.animationId);
    return scenario?.steps.length ?? 1;
  };

  const advance = () => {
    if (!card) return;
    if (card.cardType === 'animation') {
      const totalSteps = getAnimTotalSteps();
      if (animStep < totalSteps - 1) {
        setAnimStep((s) => s + 1);
        return;
      }
    }
    rewardCard(courseId, card.id, XP_PER_CARD);
    if (isLast) {
      setDone(true);
    } else {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      savePosition(nextIndex);
    }
  };

  const previous = () => {
    if (index > 0) {
      const prevIndex = index - 1;
      setIndex(prevIndex);
      savePosition(prevIndex);
    }
  };

  const handlePracticeComplete = useCallback(
    (correct: boolean) => {
      const c = cardRef.current;
      if (correct && c) {
        rewardCard(courseId, c.id, XP_PER_PRACTICE);
      }
    },
    [courseId, rewardCard],
  );

  const handlePracticeNext = useCallback(() => {
    if (isLast) {
      setDone(true);
    } else {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      savePosition(nextIndex);
    }
  }, [isLast, index, savePosition]);

  if (!card && !done) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>暂无卡片</Text>
      </View>
    );
  }

  if (done) {
    return (
      <View style={styles.resultWrap}>
        <Text style={styles.resultIcon}>🎉</Text>
        <Text style={styles.resultTitle}>学习完成</Text>
        <Text style={styles.resultSubtitle}>{node?.title}</Text>
        <TouchableOpacity
          style={styles.resultBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.resultBtnText}>返回课程</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalAnimSteps = getAnimTotalSteps();

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel="返回"
        center={<Text style={styles.module}>{node?.module}</Text>}
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
    backgroundColor: '#fff',
  },
  cardArea: {
    flex: 1,
  },
  module: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  progress: {
    fontSize: 13,
    color: '#999',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prevBtn: {
    flex: 1,
    backgroundColor: '#8899aa',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtn: {
    flex: 2,
    backgroundColor: '#4a9eff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnDone: {
    backgroundColor: '#2ed573',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  resultWrap: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  resultIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2ed573',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  resultBtn: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 10,
  },
  resultBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
