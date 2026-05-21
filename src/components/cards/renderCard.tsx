import React from 'react';
import ConceptCard from './ConceptCard';
import CodeCard from './CodeCard';
import PracticeCard from './PracticeCard';
import { getAnimScenario, getAnimComponent } from '../../data/animations';
import type { Card, AnimationContent, TextContent, CodeContent, PracticeContent } from '../../types';

interface RenderCardProps {
  card: Card;
  animStep: number;
  onPracticeComplete: (correct: boolean) => void;
  onPracticeNext: () => void;
  isLast: boolean;
}

export default function renderCard({
  card,
  animStep,
  onPracticeComplete,
  onPracticeNext,
  isLast,
}: RenderCardProps): React.ReactElement | null {
  switch (card.cardType) {
    case 'concept':
      return <ConceptCard key={card.id} content={card.content as TextContent} />;
    case 'code':
      return <CodeCard key={card.id} content={card.content as CodeContent} />;
    case 'animation': {
      const animContent = card.content as AnimationContent;
      const scenario = getAnimScenario(animContent.animationId);
      if (!scenario) return null;
      const AnimComponent = getAnimComponent(animContent.animationId);
      if (!AnimComponent) return null;
      return React.createElement(AnimComponent, { key: card.id, scenario, step: animStep });
    }
    case 'practice':
      return (
        <PracticeCard
          key={card.id}
          content={card.content as PracticeContent}
          onComplete={onPracticeComplete}
          onNext={onPracticeNext}
          isLast={isLast}
        />
      );
    default: {
      // 穷举检查：加新 cardType 时 TypeScript 在这里报错
      const _exhaustive: never = card.cardType;
      return null;
    }
  }
}
