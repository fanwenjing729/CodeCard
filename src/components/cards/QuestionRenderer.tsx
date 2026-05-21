import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import type { PracticeContent } from '../../types';

export function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function isCorrectAnswer(
  userAnswer: string | null,
  correctAnswer: string,
): boolean {
  return normalize(userAnswer ?? '') === normalize(correctAnswer);
}

interface QuestionRendererProps {
  content: PracticeContent;
  selected: string | null;
  fillAnswer: string;
  submitted: boolean;
  onSelect: (opt: string) => void;
  onFillChange: (text: string) => void;
  onSubmit: () => void;
  onNext: (() => void) | null;
  nextLabel: string;
}

export default function QuestionRenderer({
  content,
  selected,
  fillAnswer,
  submitted,
  onSelect,
  onFillChange,
  onSubmit,
  onNext,
  nextLabel,
}: QuestionRendererProps) {
  const isFill = content.questionType === 'fill';
  const rawAnswer = isFill ? fillAnswer.trim() : selected;
  const correct = submitted && isCorrectAnswer(rawAnswer, content.answer);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.wrapContent}>
      <Text style={styles.question}>{content.question}</Text>

      {/* 选择题 */}
      {!isFill &&
        content.options?.map((opt) => {
          let bg = '#f0f4ff';
          if (submitted && opt === content.answer) bg = '#d4edda';
          if (submitted && opt === selected && opt !== content.answer) bg = '#f8d7da';
          if (!submitted && opt === selected) bg = '#cce5ff';

          return (
            <TouchableOpacity
              key={opt}
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => { if (!submitted) onSelect(opt); }}
              disabled={submitted}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

      {/* 填空题 */}
      {isFill && (
        <View style={styles.fillWrap}>
          <TextInput
            style={[
              styles.fillInput,
              submitted && (correct ? styles.fillCorrect : styles.fillWrong),
            ]}
            value={fillAnswer}
            onChangeText={onFillChange}
            editable={!submitted}
            placeholder="输入你的答案..."
            placeholderTextColor="#bbb"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {submitted && !correct && (
            <Text style={styles.correctAnswer}>正确答案：{content.answer}</Text>
          )}
        </View>
      )}

      {/* 提交 */}
      {!submitted && (
        <TouchableOpacity
          style={[styles.submitBtn, !rawAnswer && styles.submitBtnDisabled]}
          onPress={onSubmit}
          disabled={!rawAnswer}
          activeOpacity={0.7}
        >
          <Text style={styles.submitText}>确认</Text>
        </TouchableOpacity>
      )}

      {/* 反馈 + 下一题 */}
      {submitted && (
        <View style={styles.feedbackWrap}>
          <View style={[styles.feedback, correct ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackIcon}>{correct ? '✓ 正确！' : '✗ 错误'}</Text>
            <Text style={styles.explanation}>{content.explanation}</Text>
          </View>
          {onNext && (
            <TouchableOpacity
              style={[styles.nextBtn, correct ? styles.nextBtnCorrect : {}]}
              onPress={onNext}
              activeOpacity={0.7}
            >
              <Text style={styles.nextText}>{nextLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  wrapContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 24,
    lineHeight: 26,
  },
  option: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d0d8f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  fillWrap: {
    marginBottom: 8,
  },
  fillInput: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  fillCorrect: {
    borderColor: '#2ed573',
    backgroundColor: '#d4edda',
  },
  fillWrong: {
    borderColor: '#ff6b6b',
    backgroundColor: '#f8d7da',
  },
  correctAnswer: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  submitBtn: {
    marginTop: 8,
    backgroundColor: '#4a9eff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackWrap: {
    marginTop: 16,
  },
  feedback: {
    padding: 16,
    borderRadius: 10,
  },
  feedbackCorrect: {
    backgroundColor: '#d4edda',
  },
  feedbackWrong: {
    backgroundColor: '#f8d7da',
  },
  feedbackIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  nextBtn: {
    marginTop: 12,
    backgroundColor: '#ff9f43',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextBtnCorrect: {
    backgroundColor: '#4a9eff',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
