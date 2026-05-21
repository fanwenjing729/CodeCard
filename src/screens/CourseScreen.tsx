import { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { courses } from '../data/courses';
import { useProgressStore } from '../store/useProgressStore';
import ListItem from '../components/shared/ListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'Course'>;

function groupByModule(nodes: typeof courses[0]['nodes']) {
  const map: Record<string, typeof nodes> = {};
  for (const node of nodes) {
    (map[node.moduleId] ??= []).push(node);
  }
  return Object.entries(map);
}

export default function CourseScreen({ route, navigation }: Props) {
  const { courseId } = route.params;
  const coursesProgress = useProgressStore((s) => s.courses);
  const insets = useSafeAreaInsets();
  const course = courses.find((c) => c.id === courseId);
  const themeColor = course?.color ?? '#4a9eff';

  const modules = useMemo(() => {
    return course ? groupByModule(course.nodes) : [];
  }, [course]);

  const completedCards = useMemo(() => {
    return coursesProgress[courseId]?.completedCards ?? [];
  }, [coursesProgress, courseId]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 42, borderBottomColor: themeColor + '40' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={[styles.backBtn, { color: themeColor }]}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{course?.title ?? ''}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.listContent, { paddingTop: 32 }]}>
        {modules.map(([moduleId, nodes]) => {
          const moduleName = nodes[0]?.module ?? moduleId;
          const allCardIds = nodes.flatMap((n) => n.cards.map((c) => c.id));
          const total = allCardIds.length;
          const done = allCardIds.filter((id) => completedCards.includes(id)).length;
          const isDone = total > 0 && done === total;
          const isStarted = done > 0 && !isDone;

          const subtitle =
            total === 0
              ? '敬请期待'
              : isDone
                ? `已完成 ${total} 张卡片`
                : `${done}/${total} 张卡片 · ${nodes.length} 个节点`;

          return (
            <ListItem
              key={moduleId}
              title={moduleName}
              subtitle={subtitle}
              status={isDone ? 'done' : isStarted ? 'started' : 'pending'}
              themeColor={themeColor}
              onPress={() => navigation.navigate('Module', { courseId, moduleId })}
            />
          );
        })}

        {modules.length === 0 && (
          <Text style={styles.empty}>暂无课程内容</Text>
        )}
      </ScrollView>
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
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 60,
    fontSize: 15,
  },
});
