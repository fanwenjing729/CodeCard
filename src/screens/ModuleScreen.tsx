import { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { courses } from '@/data/courses';
import { useProgressStore } from '@/store/useProgressStore';
import ListItem from '@/components/shared/ListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'Module'>;

export default function ModuleScreen({ route, navigation }: Props) {
  const { courseId, moduleId } = route.params;
  const coursesProgress = useProgressStore((s) => s.courses);
  const course = courses.find((c) => c.id === courseId);
  const themeColor = course?.color ?? '#4a9eff';

  const completedCards = useMemo(() => {
    return coursesProgress[courseId]?.completedCards ?? [];
  }, [coursesProgress, courseId]);

  const nodes = useMemo(() => {
    return (course?.nodes ?? []).filter((n) => n.moduleId === moduleId);
  }, [course, moduleId]);

  const moduleName = nodes[0]?.module ?? moduleId;

  return (
    <View style={styles.container}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        title={moduleName}
        backLabel="模块"
        themeColor={themeColor}
        variant="default"
      />

      <ScrollView contentContainerStyle={[styles.listContent, { paddingTop: 36 }]}>
        {nodes.map((node) => {
          const total = node.cards.length;
          const done = node.cards.filter((c) => completedCards.includes(c.id)).length;
          const isDone = total > 0 && done === total;
          const isStarted = done > 0 && !isDone;

          if (total === 0) {
            return (
              <View key={node.id} style={styles.nodeCardEmpty}>
                <Text style={styles.nodeTitleEmpty}>{node.title}</Text>
                <Text style={styles.comingSoon}>敬请期待</Text>
              </View>
            );
          }

          const subtitle = isDone
            ? `已完成 ${total} 张卡片`
            : `${done}/${total} 张卡片 · ${node.type === 'quiz' ? '测验' : '学习'}`;

          return (
            <ListItem
              key={node.id}
              title={node.title}
              subtitle={subtitle}
              status={isDone ? 'done' : isStarted ? 'started' : 'pending'}
              themeColor={themeColor}
              onPress={() => {
                if (node.type === 'quiz') {
                  navigation.navigate('Quiz', { courseId, nodeId: node.id });
                } else {
                  navigation.navigate('Node', { courseId, nodeId: node.id });
                }
              }}
            />
          );
        })}

        {nodes.length === 0 && (
          <Text style={styles.empty}>暂无内容</Text>
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  nodeCardEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    opacity: 0.5,
  },
  nodeTitleEmpty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  comingSoon: {
    fontSize: 12,
    color: '#bbb',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 60,
    fontSize: 15,
  },
});
