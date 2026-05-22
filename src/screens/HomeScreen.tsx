import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { courses } from '@/data/courses';
import { useProgressStore } from '@/store/useProgressStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const coursesProgress = useProgressStore((s) => s.courses);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { marginTop: insets.top + 42 }]}>选择学科</Text>
      <View style={{ marginTop: 21 }}>
        {courses.map((c) => {
          const progress = coursesProgress[c.id];
          const done = progress?.completedCards?.length ?? 0;
          const total = c.nodes.reduce((sum, n) => sum + n.cards.length, 0);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <TouchableOpacity
              key={c.id}
              style={styles.courseCard}
              onPress={() => navigation.navigate('Course', { courseId: c.id })}
              activeOpacity={0.7}
            >
              <View style={[styles.courseIcon, { backgroundColor: c.color }]}>
                {c.icon ? (
                  <MaterialCommunityIcons name={c.icon as any} size={24} color={Colors.textInverse} />
                ) : (
                  <Text style={styles.courseIconText}>{c.title[0]}</Text>
                )}
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{c.title}</Text>
                <Text style={styles.courseMeta}>
                  {c.nodes.filter((n) => n.cards.length > 0).length} 个模块
                  {total > 0 ? ` · ${done}/${total} · ${pct}%` : ''}
                </Text>
                {total > 0 && (
                  <View style={styles.miniBar}>
                    <View style={[styles.miniBarFill, { width: `${pct}%` as any, backgroundColor: c.color }]} />
                  </View>
                )}
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    marginTop: 64,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  courseIconText: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: '700',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  courseMeta: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 4,
  },
  miniBar: {
    height: 3,
    backgroundColor: Colors.progressBarBg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.arrow,
    fontWeight: '300',
  },
});
