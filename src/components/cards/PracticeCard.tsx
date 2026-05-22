import { useState, useEffect, useRef } from 'react';
import type { PracticeContent } from '@/types';
import QuestionRenderer, { isCorrectAnswer } from './QuestionRenderer';

export interface PracticeState {
  selected: string | null;
  fillAnswer: string;
  submitted: boolean;
}

interface Props {
  content: PracticeContent;
  onComplete: (correct: boolean) => void;
  onNext?: () => void;
  isLast?: boolean;
  savedState?: PracticeState;
  onStateChange?: (state: PracticeState) => void;
}

export default function PracticeCard({ content, onComplete, onNext, isLast, savedState, onStateChange }: Props) {
  const [selected, setSelected] = useState<string | null>(savedState?.selected ?? null);
  const [fillAnswer, setFillAnswer] = useState(savedState?.fillAnswer ?? '');
  const [submitted, setSubmitted] = useState(savedState?.submitted ?? false);

  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  useEffect(() => {
    onStateChangeRef.current?.({ selected, fillAnswer, submitted });
  }, [selected, fillAnswer, submitted]);

  const handleSubmit = () => {
    const rawAnswer = content.questionType === 'choice' ? selected : fillAnswer.trim();
    if (!rawAnswer) return;
    setSubmitted(true);
    onComplete(isCorrectAnswer(rawAnswer, content.answer));
  };

  return (
    <QuestionRenderer
      content={content}
      selected={selected}
      fillAnswer={fillAnswer}
      submitted={submitted}
      onSelect={setSelected}
      onFillChange={setFillAnswer}
      onSubmit={handleSubmit}
      onNext={onNext ?? null}
      nextLabel={isLast ? '完成' : '下一张'}
    />
  );
}
