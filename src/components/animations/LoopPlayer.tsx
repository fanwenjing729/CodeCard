import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
import type { LoopScenario } from '@/types';

interface Props {
  scenario: LoopScenario;
  step: number;
}

export default function LoopPlayer({ scenario, step }: Props) {
  const s = scenario.steps[step];
  const lines = scenario.sourceCode.split(/\r?\n/);

  return (
    <View style={styles.wrap}>
      {/* 迭代信息 */}
      <View style={styles.iterRow}>
        {s.iteration > 0 && (
          <Text style={styles.iterRound}>
            第 {s.iteration} 轮
          </Text>
        )}
        {s.iteration === 0 && (
          <Text style={styles.iterRound}>初始化</Text>
        )}
        {s.iteration === -1 && (
          <Text style={styles.iterRound}>跳出</Text>
        )}
        <Text style={[styles.iterResult, s.entered ? styles.iterEnter : styles.iterExit]}>
          {s.entered ? '进入循环体' : '循环结束'}
        </Text>
      </View>

      {/* 代码区 */}
      <View style={styles.codeBox}>
        {lines.map((line, i) => {
          const isHighlight = s.highlightLines.includes(i);
          const isBody = s.bodyLines.includes(i);

          let bgStyle = styles.codeLineDefault;
          if (isHighlight) {
            bgStyle = styles.codeLineCondition;
          } else if (isBody && s.entered) {
            bgStyle = styles.codeLineActive;
          } else if (isBody && !s.entered) {
            bgStyle = styles.codeLineSkipped;
          }

          return (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.lineNum}>{String(i + 1).padStart(2, ' ')}</Text>
              <View style={[styles.codeLine, bgStyle]}>
                <Text style={styles.codeText}>{line || ' '}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* 注释 */}
      <View style={styles.annotationBox}>
        <Text style={styles.annotationText}>{s.annotation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iterRound: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  iterResult: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  iterEnter: {
    backgroundColor: Colors.animBadgeSuccess,
    color: Colors.success,
  },
  iterExit: {
    backgroundColor: Colors.animBadgeMuted,
    color: Colors.textMuted,
  },
  codeBox: {
    backgroundColor: Colors.codeBg,
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 24,
  },
  lineNum: {
    color: Colors.codeLineNum,
    fontSize: 12,
    fontFamily: 'monospace',
    width: 22,
    textAlign: 'right',
    marginRight: 8,
  },
  codeLine: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  codeLineDefault: {
    backgroundColor: 'transparent',
  },
  codeLineCondition: {
    backgroundColor: Colors.animCodeConditionBg,
  },
  codeLineActive: {
    backgroundColor: Colors.animCodeActiveBg,
  },
  codeLineSkipped: {
    backgroundColor: Colors.animCodeSkippedBg,
  },
  codeText: {
    color: Colors.codeText,
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  annotationBox: {
    backgroundColor: Colors.bgTertiary,
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  annotationText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
