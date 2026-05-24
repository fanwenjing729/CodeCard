import { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import type { DimensionValue } from 'react-native';
import { Colors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useProgressStore } from '@/store/useProgressStore';
import { xpForLevelStart, xpForNextLevel } from '@/lib/xp';
import { courses } from '@/data/courses';
import type { RootStackParamList } from '@/navigation/AppNavigator';

// ---- 环形进度条 ----
const RING_SIZE = 160;
const RING_RADIUS = 64;
const RING_STROKE = 7;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 402
const RING_CENTER = RING_SIZE / 2;

function LevelRing({ level, xpPercent, xpIntoLevel, nextLevelXP }: {
  level: number;
  xpPercent: number;
  xpIntoLevel: number;
  nextLevelXP: number;
}) {
  const dashOffset = RING_CIRCUMFERENCE * (1 - xpPercent / 100);

  return (
    <View style={styles.ringWrap}>
      <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
        {/* 底色管道 */}
        <Circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={RING_RADIUS}
          stroke={Colors.progressBarBg}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeLinecap="round"
          rotation="-90"
          origin={`${RING_CENTER}, ${RING_CENTER}`}
        />
        {/* 进度弧 */}
        <Circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={RING_RADIUS}
          stroke={Colors.primary}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin={`${RING_CENTER}, ${RING_CENTER}`}
        />
      </Svg>
      {/* 中心文字 */}
      <View style={styles.ringLabel}>
        <Text style={styles.ringLevel}>{level}</Text>
        <Text style={styles.ringLV}>LV</Text>
        <Text style={styles.ringXP}>{xpIntoLevel}/{nextLevelXP}</Text>
      </View>
    </View>
  );
}

// ---- 页面 ----
export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const global = useProgressStore((s) => s.global);
  const coursesProgress = useProgressStore((s) => s.courses);

  const totalWrongCards = useMemo(
    () =>
      Object.values(coursesProgress).reduce(
        (sum, c) => sum + Object.keys(c.wrongCards ?? {}).length,
        0,
      ),
    [coursesProgress],
  );

  const courseWrongCounts = useMemo(() => {
    const counts: { courseId: string; title: string; color: string; count: number }[] = [];
    for (const course of courses) {
      const count = Object.keys(coursesProgress[course.id]?.wrongCards ?? {}).length;
      if (count > 0) {
        counts.push({ courseId: course.id, title: course.title, color: course.color, count });
      }
    }
    return counts;
  }, [coursesProgress]);

  const currentLevelStart = useMemo(() => xpForLevelStart(global.level), [global.level]);
  const nextLevelXP = xpForNextLevel(global.level);
  const xpIntoLevel = Math.max(0, global.totalXP - currentLevelStart);
  const xpPercent = useMemo(
    () => Math.min((xpIntoLevel / nextLevelXP) * 100, 100),
    [xpIntoLevel, nextLevelXP],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      {/* 等级卡片 — 环形进度 */}
      <View style={styles.levelCard}>
        <LevelRing
          level={global.level}
          xpPercent={xpPercent}
          xpIntoLevel={xpIntoLevel}
          nextLevelXP={nextLevelXP}
        />
      </View>

      {/* 错题集 */}
      {totalWrongCards === 0 ? (
        <View style={styles.wrongCardEmpty}>
          <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.success} />
          <Text style={styles.wrongCardEmptyText}>全部掌握</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.wrongCard}
          onPress={() => navigation.navigate('WrongCards')}
          activeOpacity={0.7}
        >
          <View style={styles.wrongHeader}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={Colors.warning} />
            <Text style={styles.wrongHeaderTitle}>错题集</Text>
            <View style={styles.wrongBadge}>
              <Text style={styles.wrongBadgeText}>{totalWrongCards}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.arrow} />
          </View>
          {courseWrongCounts.map((c) => (
            <View key={c.courseId} style={styles.wrongCourseRow}>
              <View style={[styles.wrongCourseDot, { backgroundColor: c.color }]} />
              <Text style={styles.wrongCourseName}>{c.title}</Text>
              <Text style={styles.wrongCourseCount}>{c.count} 道</Text>
            </View>
          ))}
        </TouchableOpacity>
      )}

      {/* 各学科进度 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学科进度</Text>
        {courses.map((c) => {
          const progress = coursesProgress[c.id];
          const done = Object.keys(progress?.completedCards ?? {}).length;
          const total = c.nodes.reduce((s, n) => s + n.cards.length, 0);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <View key={c.id} style={styles.courseRow}>
              <View style={styles.courseInfo}>
                <View style={[styles.courseDot, { backgroundColor: c.color }]} />
                <Text style={styles.courseName}>{c.title}</Text>
              </View>
              <View style={styles.courseBarWrap}>
                <View style={styles.courseBar}>
                  <View
                    style={[
                      styles.courseBarFill,
                      { width: `${pct}%` as DimensionValue, backgroundColor: c.color },
                    ]}
                  />
                </View>
                <Text style={styles.courseBarText}>
                  {done}/{total} · {pct}%
                </Text>
              </View>
            </View>
          );
        })}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgTertiary,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  // ---- 等级卡片 ----
  levelCard: {
    backgroundColor: Colors.bg,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringLevel: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 50,
  },
  ringLV: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: -2,
    marginBottom: 4,
  },
  ringXP: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  // ---- 错题集 ----
  wrongCard: {
    backgroundColor: Colors.bg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  wrongCardEmpty: {
    backgroundColor: Colors.bg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongCardEmptyText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: 8,
  },
  wrongHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wrongHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 8,
  },
  wrongBadge: {
    backgroundColor: Colors.warning,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 5,
  },
  wrongBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.bg,
  },
  wrongCourseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  wrongCourseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  wrongCourseName: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  wrongCourseCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  // ---- 学科 ----
  section: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  courseRow: {
    marginBottom: 16,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  courseBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.progressBarBg,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  courseBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  courseBarText: {
    fontSize: 12,
    color: Colors.textMuted,
    width: 70,
    textAlign: 'right',
  },
});
