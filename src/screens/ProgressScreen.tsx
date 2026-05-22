import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useProgressStore } from '@/store/useProgressStore';
import { courses } from '@/data/courses';

function xpForLevelStart(level: number): number {
  return 50 * (level - 1) * level;
}

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
          stroke="#e8edf2"
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
          stroke="#4a9eff"
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
  const global = useProgressStore((s) => s.global);
  const coursesProgress = useProgressStore((s) => s.courses);

  const currentLevelStart = xpForLevelStart(global.level);
  const nextLevelXP = global.level * 100;
  const xpIntoLevel = global.totalXP - currentLevelStart;
  const xpPercent = Math.min((xpIntoLevel / nextLevelXP) * 100, 100);

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

      {/* 各学科进度 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学科进度</Text>
        {courses.map((c) => {
          const progress = coursesProgress[c.id];
          const done = progress?.completedCards?.length ?? 0;
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
                      { width: `${pct}%` as any, backgroundColor: c.color },
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  // ---- 等级卡片 ----
  levelCard: {
    backgroundColor: '#fff',
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
    color: '#222',
    lineHeight: 50,
  },
  ringLV: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a9eff',
    marginTop: -2,
    marginBottom: 4,
  },
  ringXP: {
    fontSize: 12,
    color: '#999',
  },
  // ---- 学科 ----
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
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
    color: '#222',
  },
  courseBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e8edf2',
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
    color: '#999',
    width: 70,
    textAlign: 'right',
  },
});
