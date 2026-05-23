import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
import type { BranchScenario } from '@/types';

interface Props {
  scenario: BranchScenario;
  step: number;
}

export default function BranchPlayer({ scenario, step }: Props) {
  const s = scenario.steps[step];
  const lines = scenario.sourceCode.split('\n');
  const hasTaken = s.takenLines.length > 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.codeBox}>
        {lines.map((line, i) => {
          const isHighlight = s.highlightLines.includes(i);
          const isTaken = s.takenLines.includes(i);
          const isSkipped = s.skippedLines.includes(i);

          let bgStyle = styles.codeLineDefault;
          if (isHighlight) {
            bgStyle = styles.codeLineCondition;
          } else if (isTaken) {
            bgStyle = styles.codeLineTaken;
          } else if (isSkipped) {
            bgStyle = styles.codeLineSkipped;
          }

          return (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.lineNum}>{String(i + 1).padStart(2, ' ')}</Text>
              <View style={[styles.codeLine, bgStyle]}>
                <Text style={styles.codeText}>{line || ' '}</Text>
              </View>
              {isHighlight && hasTaken && (
                <Text style={styles.arrow}>↓</Text>
              )}
            </View>
          );
        })}
      </View>

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
    backgroundColor: 'rgba(74,158,255,0.20)',
  },
  codeLineTaken: {
    backgroundColor: 'rgba(46,213,115,0.18)',
  },
  codeLineSkipped: {
    backgroundColor: 'rgba(153,153,153,0.10)',
  },
  codeText: {
    color: Colors.codeText,
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  arrow: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
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
