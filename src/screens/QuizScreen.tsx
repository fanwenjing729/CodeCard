import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { PracticeContent } from '../types';
import { courses } from '../data/courses';
import { useProgressStore } from '../store/useProgressStore';
import QuestionRenderer, { isCorrectAnswer } from '../components/cards/QuestionRenderer';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ route, navigation }: Props) {
  const { courseId, nodeId } = route.params;
  const addXP = useProgressStore((s) => s.addXP);
  const completeCard = useProgressStore((s) => s.completeCard);

  const course = courses.find((c) => c.id === courseId);
  const node = course?.nodes.find((n) => n.id === nodeId);
  const cards = (node?.cards ?? []).filter((c) => c.cardType === 'practice');

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [fillAnswer, setFillAnswer] = useState('');

  const card = cards[index];
  const content = card?.content as PracticeContent | undefined;

  const resetQuestion = (nextIndex: number) => {
    setSelected(null);
    setFillAnswer('');
    setSubmitted(false);
    setIndex(nextIndex);
  };

  const handleSubmit = () => {
    if (!content || submitted) return;
    const rawAnswer = content.questionType === 'choice' ? selected : fillAnswer.trim();
    if (!rawAnswer) return;

    setSubmitted(true);
    if (isCorrectAnswer(rawAnswer, content.answer)) {
      setScore((s) => s + 1);
      const isNew = completeCard(courseId, card.id);
      if (isNew) {
        addXP(courseId, 10);
      }
    }
  };

  const handleNext = () => {
    if (index < cards.length - 1) {
      resetQuestion(index + 1);
    } else {
      setDone(true);
    }
  };

  if (!content && !done) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>暂无题目</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← 返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (done) {
    return (
      <View style={styles.resultWrap}>
        <Text style={styles.resultTitle}>测验完成</Text>
        <Text style={styles.resultScore}>
          {score} / {cards.length}
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!content) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.headerBack}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          {index + 1} / {cards.length}
        </Text>
      </View>

      <View style={styles.questionWrap}>
        <QuestionRenderer
          content={content}
          selected={selected}
          fillAnswer={fillAnswer}
          submitted={submitted}
          onSelect={setSelected}
          onFillChange={setFillAnswer}
          onSubmit={handleSubmit}
          onNext={handleNext}
          nextLabel={index < cards.length - 1 ? '下一题' : '完成测验'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBack: {
    fontSize: 15,
    color: '#4a9eff',
  },
  progress: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  questionWrap: {
    flex: 1,
  },
  resultWrap: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2ed573',
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '800',
    color: '#222',
    marginBottom: 32,
  },
  backBtn: {
    backgroundColor: '#4a9eff',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
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
    marginBottom: 16,
  },
});
