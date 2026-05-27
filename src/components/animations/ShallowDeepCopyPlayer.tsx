import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import type { AnimScenario } from '@/types';

interface Props {
  scenario: AnimScenario;
  step: number;
}

export default function ShallowDeepCopyPlayer({}: Props) {
  return (
    <View style={styles.container}>
      {/* ====== 浅拷贝 ====== */}
      <Text style={styles.sectionTitle}>浅拷贝（默认行为）</Text>

      <View style={styles.diagram}>
        {/* 左上：对象 a */}
        <View style={[styles.objBox, styles.objTopL]}>
          <Text style={styles.objName}>IntArray a</Text>
          <Text style={styles.objData}>data ●</Text>
        </View>

        {/* 右上：对象 b */}
        <View style={[styles.objBox, styles.objTopR]}>
          <Text style={styles.objName}>IntArray b</Text>
          <Text style={styles.objData}>data ●</Text>
        </View>

        {/* 中间下方：共享堆 */}
        <View style={[styles.heapBox, styles.heapShared]}>
          <Text style={styles.heapTitle}>共享堆 ⚠</Text>
          <View style={styles.cells}>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} style={styles.cell}><Text style={styles.cellText}>{i}</Text></View>
            ))}
          </View>
        </View>

        {/* 文字标注 */}
        <Text style={[styles.edgeLabel, { top: '42%', left: '8%' }]}>↘</Text>
        <Text style={[styles.edgeLabel, { top: '42%', right: '8%' }]}>↙</Text>
      </View>

      <Text style={styles.resultBad}>✗ a 析构释放堆 → b.data 悬空 → double free</Text>

      {/* ====== 分隔 ====== */}
      <View style={styles.divider} />

      {/* ====== 深拷贝 ====== */}
      <Text style={styles.sectionTitle}>深拷贝（Rule of Three）</Text>

      <View style={styles.diagram}>
        {/* 左上：对象 a */}
        <View style={[styles.objBox, styles.objTopL]}>
          <Text style={styles.objName}>IntArray a</Text>
          <Text style={styles.objData}>data ●</Text>
        </View>

        {/* 右上：对象 b */}
        <View style={[styles.objBox, styles.objTopR]}>
          <Text style={styles.objName}>IntArray b</Text>
          <Text style={styles.objData}>data ●</Text>
        </View>

        {/* 左下：堆 A */}
        <View style={[styles.heapBox, styles.heapA, styles.heapBotL]}>
          <Text style={styles.heapTitle}>堆 A</Text>
          <View style={styles.cells}>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} style={styles.cell}><Text style={styles.cellText}>{i}</Text></View>
            ))}
          </View>
        </View>

        {/* 右下：堆 B */}
        <View style={[styles.heapBox, styles.heapB, styles.heapBotR]}>
          <Text style={styles.heapTitle}>堆 B（独立副本）</Text>
          <View style={styles.cells}>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} style={styles.cellB}><Text style={styles.cellText}>{i}</Text></View>
            ))}
          </View>
        </View>

        {/* 箭头标签 */}
        <Text style={[styles.edgeLabel, { top: '65%', left: '12%' }]}>↓</Text>
        <Text style={[styles.edgeLabel, { top: '65%', right: '12%' }]}>↓</Text>
      </View>

      <Text style={styles.resultOk}>✓ 各自独立，析构互不影响</Text>

      <Text style={styles.hint}>💡 后续可替换为 Lottie MG 动画</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  diagram: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  objBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    zIndex: 2,
  },
  objTopL: { top: 0, left: 4 },
  objTopR: { top: 0, right: 4 },
  objName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  objData: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  heapBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  heapBotL: { bottom: 0, left: 4 },
  heapBotR: { bottom: 0, right: 4 },
  heapShared: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245,158,11,0.06)',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -58 }, { translateY: -18 }],
  },
  heapA: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(52,211,153,0.06)',
  },
  heapB: {
    borderColor: '#4a9eff',
    backgroundColor: 'rgba(74,158,255,0.06)',
  },
  heapTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  cells: {
    flexDirection: 'row',
    gap: 3,
  },
  cell: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#d4edda',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellB: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  edgeLabel: {
    position: 'absolute',
    fontSize: 18,
    color: Colors.textMuted,
    zIndex: 1,
  },
  resultBad: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
    marginTop: 2,
  },
  resultOk: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
    marginTop: 2,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  hint: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 8,
  },
});
