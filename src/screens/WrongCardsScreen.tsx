import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme';
import { useProgressStore } from '@/store/useProgressStore';
import { getCourse, getCourses, useCourse } from '@/lib/useCourses';
import ScreenHeader from '@/components/shared/ScreenHeader';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { PracticeContent } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WrongCards'>;

interface WrongEntry {
  courseId: string;
  moduleId: string;
  module: string;
  cardId: string;
  content: PracticeContent;
}

function collectWrongCards(coursesState: Record<string, { wrongCards?: Record<string, true> }>): WrongEntry[] {
  const entries: WrongEntry[] = [];
  for (const course of getCourses()) {
    const progress = coursesState[course.id];
    if (!progress?.wrongCards || Object.keys(progress.wrongCards).length === 0) continue;
    for (const node of course.nodes) {
      for (const card of node.cards) {
        if (card.cardType === 'practice' && card.id in progress.wrongCards) {
          entries.push({
            courseId: course.id,
            moduleId: node.moduleId,
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

// ===== Level 1: 课程列表 =====
function CourseList({
  entries,
  onPress,
}: {
  entries: WrongEntry[];
  onPress: (course: { id: string; title: string; color: string }) => void;
}) {
  type Summary = { id: string; title: string; color: string; count: number };
  const map = new Map<string, Summary>();
  for (const e of entries) {
    const s = map.get(e.courseId);
    if (s) { s.count++; } else {
      const c = getCourse(e.courseId);
      map.set(e.courseId, { id: e.courseId, title: c?.title ?? '', color: c?.color ?? Colors.primary, count: 1 });
    }
  }
  const summaries = [...map.values()];

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {summaries.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={styles.row}
          onPress={() => onPress({ id: c.id, title: c.title, color: c.color })}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.dot, { backgroundColor: c.color }]} />
            <Text style={styles.rowTitle}>{c.title}</Text>
          </View>
          <View style={styles.rowRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{c.count}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ===== Level 2: 模块列表 =====
function ModuleList({
  entries,
  onPress,
}: {
  entries: WrongEntry[];
  onPress: (moduleId: string, moduleName: string) => void;
}) {
  type Summary = { moduleId: string; module: string; count: number };
  const map = new Map<string, Summary>();
  for (const e of entries) {
    const s = map.get(e.moduleId);
    if (s) { s.count++; } else {
      map.set(e.moduleId, { moduleId: e.moduleId, module: e.module, count: 1 });
    }
  }
  const summaries = [...map.values()];

  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {summaries.map((m) => (
        <TouchableOpacity
          key={m.moduleId}
          style={styles.row}
          onPress={() => onPress(m.moduleId, m.module)}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Text style={styles.moduleIcon}>📦</Text>
            <Text style={styles.rowTitle}>{m.module}</Text>
          </View>
          <View style={styles.rowRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{m.count}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ===== Level 3: 错题详情 =====
function CardList({ entries }: { entries: WrongEntry[] }) {
  return (
    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
      {entries.map((entry) => (
        <View key={entry.cardId} style={styles.card}>
          <Text style={styles.question}>{entry.content.question}</Text>
          <View style={styles.answerRow}>
            <Text style={styles.answerLabel}>答案 </Text>
            <Text style={styles.answerText}>{entry.content.answer}</Text>
          </View>
          <Text style={styles.explanation}>{entry.content.explanation}</Text>
        </View>
      ))}
      <Text style={styles.footer}>共 {entries.length} 道错题 · 答对后自动移除</Text>
    </ScrollView>
  );
}

// ===== Screen =====
export default function WrongCardsScreen({ route, navigation }: Props) {
  const coursesState = useProgressStore((s) => s.courses);
  const { courseId, moduleId } = route.params ?? {};

  const allEntries = collectWrongCards(coursesState);

  // Level 1 — 课程列表
  if (!courseId) {
    return (
      <View style={styles.container}>
        <ScreenHeader onBack={() => navigation.goBack()} backLabel="返回" title="错题集" variant="default" />
        {allEntries.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyTitle}>暂无错题</Text>
            <Text style={styles.emptySubtitle}>答题时选错会自动收录到这里</Text>
          </View>
        ) : (
          <CourseList
            entries={allEntries}
            onPress={(course) => navigation.push('WrongCards', { courseId: course.id })}
          />
        )}
      </View>
    );
  }

  // Level 2 — 模块列表
  const courseEntries = allEntries.filter((e) => e.courseId === courseId);
  const course = useCourse(courseId);

  if (!moduleId) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          onBack={() => navigation.goBack()}
          backLabel="错题集"
          title={course?.title ?? ''}
          variant="default"
        />
        {courseEntries.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>全部掌握</Text>
            <Text style={styles.emptySubtitle}>这门课的错题都已消灭</Text>
          </View>
        ) : (
          <ModuleList
            entries={courseEntries}
            onPress={(mid, mname) => navigation.push('WrongCards', { courseId, moduleId: mid })}
          />
        )}
      </View>
    );
  }

  // Level 3 — 错题详情
  const moduleEntries = courseEntries.filter((e) => e.moduleId === moduleId);

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel={course?.title ?? '返回'}
        title={moduleEntries[0]?.module ?? moduleId}
        variant="default"
      />
      {moduleEntries.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.emptyTitle}>全部掌握</Text>
          <Text style={styles.emptySubtitle}>此模块的错题都已消灭</Text>
        </View>
      ) : (
        <CardList entries={moduleEntries} />
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
  // ---- Level 1 & 2: 列表行 ----
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  moduleIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: Colors.warning,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginRight: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.bg,
  },
  arrow: {
    fontSize: 22,
    color: Colors.arrow,
    fontWeight: '300',
  },
  // ---- Level 3: 卡片详情 ----
  card: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
