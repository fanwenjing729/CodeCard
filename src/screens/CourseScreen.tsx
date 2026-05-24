import { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors } from '@/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { courses } from '@/data/courses';
import { useProgressStore } from '@/store/useProgressStore';
import { countNodeCards } from '@/lib/courseProgress';
import ListItem from '@/components/shared/ListItem';

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
  const course = courses.find((c) => c.id === courseId);
  const themeColor = course?.color ?? Colors.primary;

  const modules = useMemo(() => {
    if (!course) return [];
    const nodeMap = Object.fromEntries(groupByModule(course.nodes));
    return course.modulesMeta.map(m => ({
      ...m,
      nodes: nodeMap[m.moduleId] ?? [],
    }));
  }, [course]);

  const completedCards = useMemo(() => {
    return coursesProgress[courseId]?.completedCards ?? {};
  }, [coursesProgress, courseId]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={course?.title ?? ''}
        themeColor={themeColor}
        variant="default"
      />

      <ScrollView contentContainerStyle={[styles.listContent, { paddingTop: 32 }]}>
        {modules.map(({ moduleId, module: moduleName, nodes }) => {
          const { total, done } = countNodeCards(nodes, completedCards);
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
              onPress={nodes.length > 0 ? () => navigation.navigate('Module', { courseId, moduleId }) : undefined}
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
    backgroundColor: Colors.bg,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 60,
    fontSize: 15,
  },
});
