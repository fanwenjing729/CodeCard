import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressStore } from '@/store/useProgressStore';
import { courses } from '@/data/courses';
import ScreenHeader from '@/components/shared/ScreenHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { PracticeContent } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WrongCards'>;

interface WrongEntry {
  courseId: string;
  courseTitle: string;
  courseColor: string;
  module: string;
  cardId: string;
  content: PracticeContent;
}

function collectWrongCards(coursesState: Record<string, { wrongCards?: Record<string, true> }>): WrongEntry[] {
  const entries: WrongEntry[] = [];
  for (const course of courses) {
    const progress = coursesState[course.id];
    if (!progress?.wrongCards || Object.keys(progress.wrongCards).length === 0) continue;
    for (const node of course.nodes) {
      for (const card of node.cards) {
        if (card.cardType === 'practice' && card.id in progress.wrongCards) {
          entries.push({
            courseId: course.id,
            courseTitle: course.title,
            courseColor: course.color,
            module: node.module,
            cardId: card.id,
            content: card.content as PracticeContent,
          });
        }
      }
    }
  }
  return entries;
}

export default function WrongCardsScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const coursesState = useProgressStore((s) => s.courses);
  const courseId = route.params?.courseId;

  const allEntries = collectWrongCards(coursesState);
  const filtered = courseId ? allEntries.filter((e) => e.courseId === courseId) : allEntries;

  // 课程列表视图（无 courseId 时）
  if (!courseId) {
    const courseSummaries: { courseId: string; title: string; color: string; count: number; firstQ: string }[] = [];
    for (const course of courses) {
      const entries = allEntries.filter((e) => e.courseId === course.id);
      if (entries.length === 0) continue;
      courseSummaries.push({
        courseId: course.id,
        title: course.title,
        color: course.color,
        count: entries.length,
        firstQ: entries[0].content.question,
      });
    }

    return (
      <View style={[styles.container, { paddingTop: Math.max(0, insets.top - 20) }]}>
        <ScreenHeader onBack={() => navigation.goBack()} backLabel="返回" title="错题集" variant="default" />

        {courseSummaries.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>暂无错题</Text>
            <Text style={styles.emptySubtitle}>答题时选错会自动收录到这里</Text>
          </View>
        ) : (
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {courseSummaries.map((c) => (
              <TouchableOpacity
                key={c.courseId}
                style={styles.courseCard}
                onPress={() => navigation.push('WrongCards', { courseId: c.courseId })}
                activeOpacity={0.7}
              >
                <View style={styles.courseCardHeader}>
                  <View style={[styles.courseDot, { backgroundColor: c.color }]} />
                  <Text style={styles.courseCardTitle}>{c.title}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{c.count}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.arrow} style={styles.courseArrow} />
                </View>
                <Text style={styles.coursePreview} numberOfLines={1}>{c.firstQ}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  // 详情视图（有 courseId 时）
  const course = courses.find((c) => c.id === courseId);

  return (
    <View style={[styles.container, { paddingTop: Math.max(0, insets.top - 20) }]}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel="错题集"
        title={course?.title ?? ''}
        variant="default"
      />

      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>全部掌握</Text>
          <Text style={styles.emptySubtitle}>这门课的错题都已消灭</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {filtered.map((entry) => (
            <View key={entry.cardId} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.moduleTag}>{entry.module}</Text>
              </View>
              <Text style={styles.question}>{entry.content.question}</Text>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>答案 </Text>
                <Text style={styles.answerText}>{entry.content.answer}</Text>
              </View>
              <Text style={styles.explanation}>{entry.content.explanation}</Text>
            </View>
          ))}
          <Text style={styles.footer}>共 {filtered.length} 道错题 · 答对后自动移除</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgTertiary,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 23,
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  // ---- 课程列表 ----
  courseCard: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  courseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  courseCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: Colors.warning,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.bg,
  },
  courseArrow: {
    marginLeft: 8,
  },
  coursePreview: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  // ---- 卡片详情 ----
  card: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moduleTag: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.success,
  },
  explanation: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textPlaceholder,
    marginTop: 16,
  },
});
