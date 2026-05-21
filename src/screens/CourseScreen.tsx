import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { courses } from '../data/courses';
import { useProgressStore } from '../store/useProgressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Course'>;

function groupByChapter(nodes: typeof courses[0]['nodes']) {
  const map: Record<string, typeof nodes> = {};
  for (const node of nodes) {
    (map[node.chapter] ??= []).push(node);
  }
  return Object.entries(map);
}

export default function CourseScreen({ route, navigation }: Props) {
  const { courseId } = route.params;
  const coursesProgress = useProgressStore((s) => s.courses);
  const course = courses.find((c) => c.id === courseId);
  const chapters = course ? groupByChapter(course.nodes) : [];
  const themeColor = course?.color ?? '#4a9eff';
  const completedCards = coursesProgress[courseId]?.completedCards ?? [];

  return (
    <View style={styles.container}>
      {/* 顶部 */}
      <View style={[styles.header, { borderBottomColor: themeColor + '40' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={[styles.backBtn, { color: themeColor }]}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{course?.title ?? ''}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 模块列表 */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {chapters.map(([chapterName, nodes]) => {
          const hasContent = nodes.some((n) => n.cards.length > 0);
          return (
            <View key={chapterName}>
              <Text style={styles.chapterTitle}>{chapterName}</Text>
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

                return (
                  <TouchableOpacity
                    key={node.id}
                    style={[
                      styles.nodeCard,
                      isDone && { borderColor: themeColor + '40', backgroundColor: themeColor + '08' },
                    ]}
                    onPress={() => {
                    if (node.type === 'quiz') {
                      navigation.navigate('Quiz', { courseId, nodeId: node.id });
                    } else {
                      navigation.navigate('Node', { courseId, nodeId: node.id });
                    }
                  }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.nodeLeft}>
                      <View
                        style={[
                          styles.nodeDot,
                          { backgroundColor: isDone ? '#2ed573' : isStarted ? themeColor : '#ccc' },
                          isDone && { width: 22, height: 22, borderRadius: 11, marginRight: 4 },
                        ]}
                      >
                        {isDone && <Text style={styles.nodeCheck}>✓</Text>}
                      </View>
                      <View>
                        <Text style={[styles.nodeTitle, isDone && { color: '#999' }]}>
                          {node.title}
                        </Text>
                        <Text style={styles.nodeMeta}>
                          {isDone
                            ? `已完成 ${total} 张卡片`
                            : `${done}/${total} 张卡片 · ${node.type === 'quiz' ? '测验' : '学习'}`}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.nodeArrow}>›</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        {chapters.length === 0 && (
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
    paddingTop: 64,
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
  chapterTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 4,
  },
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
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
  nodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  nodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  nodeTitleEmpty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  nodeMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  comingSoon: {
    fontSize: 12,
    color: '#bbb',
  },
  nodeArrow: {
    fontSize: 22,
    color: '#ccc',
    fontWeight: '300',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 60,
    fontSize: 15,
  },
});
