import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/theme';
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
      <View style={{ marginTop: insets.top + 42 }}>
        <Text style={styles.heading}>CodeCard</Text>
        <Text style={styles.subtitle}>选择学科开始学习</Text>
      </View>
      <View style={styles.list}>
        {courses.map((c) => {
          const progress = coursesProgress[c.id];
          const done = Object.keys(progress?.completedCards ?? {}).length;
          const { total, moduleCount } = c.nodes.reduce(
            (acc, n) => {
              acc.total += n.cards.length;
              if (n.cards.length > 0) acc.moduleCount++;
              return acc;
            },
            { total: 0, moduleCount: 0 },
          );
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.card, { borderLeftColor: c.color }]}
              onPress={() => navigation.navigate('Course', { courseId: c.id })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: c.color }]}>
                {c.icon ? (
                  <MaterialCommunityIcons name={c.icon as any} size={26} color={Colors.textInverse} />
                ) : (
                  <Text style={styles.iconText}>{c.title[0]}</Text>
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{c.title}</Text>
                <Text style={styles.meta}>
                  {moduleCount > 0
                    ? `${moduleCount} 个模块 · ${total} 张卡片`
                    : '暂无内容'}
                </Text>
                {total > 0 && (
                  <View style={styles.progressRow}>
                    <View style={styles.miniBar}>
                      <View style={[styles.miniBarFill, { width: `${pct}%` as any, backgroundColor: c.color }]} />
                    </View>
                    <Text style={styles.pct}>{pct}%</Text>
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
    backgroundColor: Colors.bgTertiary,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    paddingHorizontal: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginTop: 4,
    paddingHorizontal: Spacing.lg,
  },
  list: {
    marginTop: 20,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.lg,
    marginVertical: Spacing.lg,
  },
  iconText: {
    color: Colors.textInverse,
    fontSize: 22,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  meta: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 3,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  miniBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.progressBarBg,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 10,
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  pct: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    width: 36,
    textAlign: 'right',
  },
  arrow: {
    fontSize: 22,
    color: Colors.arrow,
    fontWeight: '300',
    marginRight: Spacing.md,
  },
});
