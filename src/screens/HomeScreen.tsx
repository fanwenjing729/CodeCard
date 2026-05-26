import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import type { DimensionValue } from 'react-native';
import { Colors, useColors, FontSize, FontFamily, Radius, Spacing } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useProgressStore } from '@/store/useProgressStore';
import { countNodeCards } from '@/lib/courseProgress';
import { useCourses } from '@/lib/useCourses';
import Skeleton from '@/components/shared/Skeleton';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const coursesProgress = useProgressStore((s) => s.courses);
  const hydrated = useProgressStore((s) => s.hydrated);
  const courses = useCourses();
  const C = useColors();

  if (!hydrated) {
    return (
      <View style={[styles.container, { backgroundColor: C.bgTertiary }]}>
        <View style={{ marginTop: insets.top + 42, paddingHorizontal: Spacing.lg }}>
          <Skeleton width={160} height={32} borderRadius={4} />
          <View style={{ height: 4 }} />
          <Skeleton width={120} height={15} borderRadius={4} />
        </View>
        <View style={[styles.list, { marginTop: 20 }]}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.card, { backgroundColor: C.bg, borderLeftWidth: 0 }]}>
              <Skeleton width={48} height={48} borderRadius={14} />
              <View style={styles.info}>
                <Skeleton width={100} height={17} borderRadius={4} />
                <View style={{ height: 3 }} />
                <Skeleton width={140} height={13} borderRadius={4} />
                <View style={{ height: 8 }} />
                <Skeleton width="80%" height={4} borderRadius={2} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.bgTertiary }]}>
      <View style={{ marginTop: insets.top + 42 }}>
        <Text style={[styles.heading, { color: C.text }]}>CodeCard</Text>
        <Text style={[styles.subtitle, { color: C.textMuted }]}>选择学科开始学习</Text>
      </View>
      <View style={styles.list}>
        {courses.map((c) => {
          const progress = coursesProgress[c.id];
          const { total, done, pct } = countNodeCards(c.nodes, progress?.completedCards ?? {});

          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.card, { borderLeftColor: c.color, backgroundColor: C.bg }]}
              onPress={() => navigation.navigate('Course', { courseId: c.id })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: c.color }]}>
                {c.icon ? (
                  <MaterialCommunityIcons name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={26} color={C.textInverse} />
                ) : (
                  <Text style={styles.iconText}>{c.title[0]}</Text>
                )}
              </View>
              <View style={styles.info}>
                <Text style={[styles.title, { color: C.text }]}>{c.title}</Text>
                <Text style={[styles.meta, { color: C.textMuted }]}>
                  {c.moduleCount > 0
                    ? `${c.moduleCount} 个模块 · ${total} 张卡片`
                    : '暂无内容'}
                </Text>
                {total > 0 && (
                  <View style={styles.progressRow}>
                    <View style={[styles.miniBar, { backgroundColor: C.progressBarBg }]}>
                      <View style={[styles.miniBarFill, { width: `${pct}%` as DimensionValue, backgroundColor: c.color }]} />
                    </View>
                    <Text style={[styles.pct, { color: C.textMuted }]}>{pct}%</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.arrow, { color: C.arrow }]}>›</Text>
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
    fontFamily: FontFamily.sansBold,
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
    fontFamily: FontFamily.sansBold,
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
