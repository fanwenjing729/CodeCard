import { useState } from 'react';
import type { PracticeContent } from '@/types';
import QuestionRenderer, { isCorrectAnswer } from './QuestionRenderer';

interface Props {
  content: PracticeContent;
  onComplete: (correct: boolean) => void;
  onNext?: () => void;
  isLast?: boolean;
}

export default function PracticeCard({ content, onComplete, onNext, isLast }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
