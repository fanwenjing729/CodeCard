import { useState, useEffect, useRef, useCallback } from 'react';
import type { Card } from '@/types';
import type { PracticeState } from '@/components/cards/PracticeCard';
import { getAnimScenario } from '@/data/animations';
import { useProgressStore, XP_PER_CARD, XP_PER_PRACTICE } from '@/store/useProgressStore';

interface UseNodeScreenArgs {
  courseId: string;
  nodeId: string;
  cards: Card[];
  savedIndex: number;
  navigation: { goBack: () => void };
}

export function useNodeScreen({ courseId, nodeId, cards, savedIndex, navigation }: UseNodeScreenArgs) {
  const rewardCard = useProgressStore((s) => s.rewardCard);
  const setNodePosition = useProgressStore((s) => s.setNodePosition);
  const addWrongCard = useProgressStore((s) => s.addWrongCard);
  const removeWrongCard = useProgressStore((s) => s.removeWrongCard);

  const [index, setIndex] = useState(Math.min(savedIndex, Math.max(0, cards.length - 1)));
  const [animStep, setAnimStep] = useState(0);

  const indexRef = useRef(index);
  indexRef.current = index;
  const cardRef = useRef(cards[index]);
  cardRef.current = cards[index];

  const practiceStates = useRef<Map<string, PracticeState>>(new Map());

  const card = cards[index];
  const isLast = index === cards.length - 1;

  useEffect(() => {
    setAnimStep(0);
  }, [card?.id]);

  useEffect(() => {
    return () => {
      setNodePosition(courseId, nodeId, indexRef.current);
    };
  }, [courseId, nodeId, setNodePosition]);

  const savePosition = useCallback(
    (i: number) => {
      setNodePosition(courseId, nodeId, i);
    },
    [courseId, nodeId, setNodePosition],
  );

  const getAnimTotalSteps = useCallback((): number => {
    if (!card || card.cardType !== 'animation') return 1;
    const scenario = getAnimScenario(card.content.animationId);
    return scenario?.totalSteps ?? 1;
  }, [card]);

  const advance = useCallback(() => {
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
      savePosition(index);
      navigation.goBack();
    } else {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      savePosition(nextIndex);
    }
  }, [card, animStep, getAnimTotalSteps, rewardCard, courseId, isLast, index, savePosition, navigation]);

  const previous = useCallback(() => {
    if (index > 0) {
      const prevIndex = index - 1;
      setIndex(prevIndex);
      savePosition(prevIndex);
    }
  }, [index, savePosition]);

  const handlePracticeStateChange = useCallback((cardId: string, state: PracticeState) => {
    practiceStates.current.set(cardId, state);
  }, []);

  const handlePracticeComplete = useCallback(
    (correct: boolean) => {
      const c = cardRef.current;
      if (!c) return;
      if (correct) {
        rewardCard(courseId, c.id, XP_PER_PRACTICE);
        removeWrongCard(courseId, c.id);
      } else {
        addWrongCard(courseId, c.id);
      }
    },
    [courseId, rewardCard, addWrongCard, removeWrongCard],
  );

  const handlePracticeNext = useCallback(() => {
    if (isLast) {
      savePosition(index);
      navigation.goBack();
    } else {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      savePosition(nextIndex);
    }
  }, [isLast, index, savePosition, navigation]);

  return {
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
  };
}
