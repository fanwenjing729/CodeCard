import { useMemo, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors, useColors } from '@/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { useProgressStore } from '@/store/useProgressStore';
import { countNodeCards } from '@/lib/courseProgress';
import ListItem from '@/components/shared/ListItem';
import { useCourse } from '@/lib/useCourses';
import type { PathNode } from '@/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Course'>;

function groupByModule(nodes: PathNode[]) {
  const map: Record<string, PathNode[]> = {};
  for (const node of nodes) {
    (map[node.moduleId] ??= []).push(node);
  }
  return Object.entries(map);
}

export default function CourseScreen({ route, navigation }: Props) {
  const { courseId } = route.params;
  const C = useColors();
  const coursesProgress = useProgressStore((s) => s.courses);
  const course = useCourse(courseId);
  const themeColor = course?.color ?? Colors.primary;

  useLayoutEffect(() => {
    navigation.setOptions({ contentStyle: { backgroundColor: C.bg } });
  }, [navigation, C.bg]);

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
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={course?.title ?? ''}
        themeColor={themeColor}
        variant="default"
      />

      <ScrollView contentContainerStyle={[styles.listContent, { paddingTop: 32 }]}>
        {modules.map(({ moduleId, module: moduleName, nodes, note }) => {
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
              note={note}
              status={isDone ? 'done' : isStarted ? 'started' : 'pending'}
              themeColor={themeColor}
              onPress={nodes.length > 0 ? () => navigation.navigate('Module', { courseId, moduleId }) : undefined}
            />
          );
        })}

        {modules.length === 0 && (
          <Text style={[styles.empty, { color: C.textMuted }]}>暂无课程内容</Text>
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
