import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
import type { ScopeCodeScenario } from '@/types';

interface Props {
  scenario: ScopeCodeScenario;
  step: number;
}

export default function ScopeCodePlayer({ scenario, step }: Props) {
  const s = scenario.steps[step];
  const lines = scenario.sourceCode.split('\n');

  return (
    <View style={styles.wrap}>
      {/* 代码区 */}
      <View style={styles.codeBox}>
        {lines.map((line, i) => {
          const active = s.highlightLines.includes(i);
          return (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.lineNum}>{String(i + 1).padStart(2, ' ')}</Text>
              <View style={[styles.codeLine, active && styles.codeLineActive]}>
                <Text style={[styles.codeText, active && styles.codeTextActive]}>
                  {line || ' '}
                </Text>
              </View>
              {active && <Text style={styles.arrow}>←</Text>}
            </View>
          );
        })}
      </View>

      {/* 箭头 */}
      <Text style={styles.downArrow}>↓</Text>

      {/* 内存格子 */}
      <View style={styles.memRow}>
        {s.allocations.length === 0 ? (
          <Text style={styles.memEmpty}>内存为空</Text>
        ) : (
          s.allocations.map((alloc, i) => (
            <View
              key={i}
              style={[
                styles.cell,
                {
                  backgroundColor: alloc.color,
                  width: alloc.typeSize * 14,
                },
              ]}
            >
              <Text style={styles.cellName}>{alloc.name}</Text>
              <Text style={styles.cellVal}>
                {alloc.value !== '-' ? alloc.value : ''}
              </Text>
            </View>
          ))
        )}
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
  codeBox: {
    backgroundColor: Colors.codeBg,
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 22,
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
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  codeLineActive: {
    backgroundColor: 'rgba(74,158,255,0.25)',
  },
  codeText: {
    color: Colors.codeText,
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  codeTextActive: {
    color: '#fff',
  },
  arrow: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  downArrow: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 4,
  },
  memRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    marginBottom: 12,
  },
  memEmpty: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  cell: {
    height: 40,
    borderRadius: 6,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 28,
    paddingHorizontal: 4,
  },
  cellName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cellVal: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
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
