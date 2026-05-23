import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';

interface CodeBlockProps {
  code: string;
  highlightLines: number[];
  iteration: number;
  entered: boolean;
  label: string;
}

export default function CodeBlock({ code, highlightLines, iteration, entered, label }: CodeBlockProps) {
  const lines = code.split(/\r?\n/);
  const done = iteration === -1;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={[styles.blockLabel, done && styles.blockLabelDone]}>{label}</Text>
        {done ? (
          <Text style={styles.blockStatus}>循环结束</Text>
        ) : entered ? (
          <Text style={styles.blockStatus}>进入循环体</Text>
        ) : (
          <Text style={styles.blockStatusSkipped}>跳过</Text>
        )}
      </View>
      <View style={styles.codeBox}>
        {lines.map((line, i) => {
          const active = highlightLines.includes(i);
          return (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.lineNum}>{String(i + 1).padStart(2, ' ')}</Text>
              <View style={[styles.codeLine, active && styles.codeLineActive]}>
                <Text style={[styles.codeText, active && styles.codeTextActive]}>{line || ' '}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {},
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  blockLabel: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  blockLabelDone: {
    color: Colors.textMuted,
  },
  blockStatus: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
    backgroundColor: Colors.animBadgeSuccess,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  blockStatusSkipped: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
    backgroundColor: Colors.animBadgeMuted,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  codeBox: {
    backgroundColor: Colors.codeBg,
    borderRadius: 8,
    padding: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
  },
  lineNum: {
    color: Colors.codeLineNum,
    fontSize: 11,
    fontFamily: 'monospace',
    width: 18,
    textAlign: 'right',
    marginRight: 6,
  },
  codeLine: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  codeLineActive: {
    backgroundColor: Colors.animCodeActiveBg,
  },
  codeText: {
    color: Colors.codeText,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  codeTextActive: {
    color: Colors.textInverse,
  },
});
