import React from 'react';
import ConceptCard from './ConceptCard';
import CodeCard from './CodeCard';
import PracticeCard, { type PracticeState } from './PracticeCard';
import { getAnimScenario, getAnimComponent } from '@/data/animations';
import type { Card } from '@/types';

interface RenderCardProps {
  card: Card;
  animStep: number;
  onPracticeComplete: (correct: boolean) => void;
  onPracticeNext: () => void;
  isLast: boolean;
  practiceState?: PracticeState;
  onPracticeStateChange?: (state: PracticeState) => void;
}

export default function renderCard({
  card,
  animStep,
  onPracticeComplete,
  onPracticeNext,
  isLast,
  practiceState,
  onPracticeStateChange,
}: RenderCardProps): React.ReactElement | null {
  switch (card.cardType) {
    case 'concept':
      return <ConceptCard key={card.id} content={card.content} />;
    case 'code':
      return <CodeCard key={card.id} content={card.content} />;
    case 'animation': {
      const scenario = getAnimScenario(card.content.animationId);
      if (!scenario) return null;
      const AnimComponent = getAnimComponent(card.content.animationId);
      if (!AnimComponent) return null;
      return React.createElement(AnimComponent, { key: card.id, scenario, step: animStep });
    }
    case 'practice':
      return (
        <PracticeCard
          key={card.id}
          content={card.content}
          onComplete={onPracticeComplete}
          onNext={onPracticeNext}
          isLast={isLast}
          savedState={practiceState}
          onStateChange={onPracticeStateChange}
        />
      );
    default: {
      const _exhaustive: never = card;
      return null;
    }
  }
}
