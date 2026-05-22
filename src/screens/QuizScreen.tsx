import { useReducer } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { PracticeContent } from '@/types';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { courses } from '@/data/courses';
import { useProgressStore, XP_PER_PRACTICE } from '@/store/useProgressStore';
import QuestionRenderer, { isCorrectAnswer } from '@/components/cards/QuestionRenderer';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

interface QuizState {
  index: number;
  score: number;
  done: boolean;
  submitted: boolean;
  selected: string | null;
  fillAnswer: string;
}

type QuizAction =
  | { type: 'SELECT'; value: string }
  | { type: 'FILL'; value: string }
  | { type: 'SUBMIT' }
  | { type: 'SCORE' }
  | { type: 'NEXT'; nextIndex: number }
  | { type: 'DONE' }
  | { type: 'RESET' };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, selected: action.value };
    case 'FILL':
      return { ...state, fillAnswer: action.value };
    case 'SUBMIT':
      return { ...state, submitted: true };
    case 'SCORE':
      return { ...state, score: state.score + 1 };
    case 'NEXT':
      return { ...state, index: action.nextIndex, submitted: false, selected: null, fillAnswer: '' };
    case 'DONE':
      return { ...state, done: true };
    case 'RESET':
      return { index: 0, score: 0, done: false, submitted: false, selected: null, fillAnswer: '' };
  }
}

export default function QuizScreen({ route, navigation }: Props) {
  const { courseId, nodeId } = route.params;
  const rewardCard = useProgressStore((s) => s.rewardCard);
  const saveQuizScore = useProgressStore((s) => s.saveQuizScore);

  const course = courses.find((c) => c.id === courseId);
  const node = course?.nodes.find((n) => n.id === nodeId);

  const allNodeCards = node?.cards ?? [];
  const nonPracticeCards = allNodeCards.filter((c) => c.cardType !== 'practice');
  if (nonPracticeCards.length > 0) {
    console.warn(
      `[CodeCard] Quiz node "${nodeId}" has ${nonPracticeCards.length} non-practice card(s):`,
      nonPracticeCards.map((c) => c.id),
    );
  }
  const cards = allNodeCards.filter((c) => c.cardType === 'practice');

  const [state, dispatch] = useReducer(quizReducer, {
    index: 0,
    score: 0,
    done: false,
    submitted: false,
    selected: null,
    fillAnswer: '',
  });

  const { index, score, done, submitted, selected, fillAnswer } = state;
  const card = cards[index];
  const content = card?.content as PracticeContent | undefined;

  const handleSubmit = () => {
    if (!content || submitted) return;
    const rawAnswer = content.questionType === 'choice' ? selected : fillAnswer.trim();
    if (!rawAnswer) return;

    dispatch({ type: 'SUBMIT' });
    if (isCorrectAnswer(rawAnswer, content.answer)) {
      dispatch({ type: 'SCORE' });
      rewardCard(courseId, card.id, XP_PER_PRACTICE);
    }
  };

  const handleNext = () => {
    if (index < cards.length - 1) {
      dispatch({ type: 'NEXT', nextIndex: index + 1 });
    } else {
      saveQuizScore(courseId, nodeId, score);
      dispatch({ type: 'DONE' });
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
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel="返回"
        right={<Text style={styles.progress}>{index + 1} / {cards.length}</Text>}
        variant="compact"
      />

      <View style={styles.questionWrap}>
        <QuestionRenderer
          content={content}
          selected={selected}
          fillAnswer={fillAnswer}
          submitted={submitted}
          onSelect={(val) => dispatch({ type: 'SELECT', value: val })}
          onFillChange={(val) => dispatch({ type: 'FILL', value: val })}
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
