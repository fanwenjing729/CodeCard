import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
import type { WhileDoWhileScenario } from '@/data/animations/scenarios/whileDoWhile';

interface Props {
  scenario: WhileDoWhileScenario;
  step: number;
}

function CodeBlock({
  code,
  highlightLines,
  iteration,
  entered,
  label,
}: {
  code: string;
  highlightLines: number[];
  iteration: number;
  entered: boolean;
  label: string;
}) {
  const lines = code.split('\n');
  const done = iteration === -1;
  const init = iteration === 0;

  return (
    <View style={styles.block}>
      <View style={styles.blockHeader}>
        <Text style={[styles.blockLabel, done && styles.blockLabelDone]}>
          {label}
        </Text>
        {done && !init && (
          <Text style={styles.blockStatus}>循环结束</Text>
        )}
        {entered && (
          <Text style={styles.blockStatus}>执行循环体</Text>
        )}
      </View>
      <View style={styles.codeBox}>
        {lines.map((line, i) => {
          const active = highlightLines.includes(i);
          return (
            <View key={i} style={styles.codeRow}>
              <Text style={styles.lineNum}>
                {String(i + 1).padStart(2, ' ')}
              </Text>
              <View style={[styles.codeLine, active && styles.codeLineActive]}>
                <Text style={[styles.codeText, active && styles.codeTextActive]}>
                  {line || ' '}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function WhileDoWhilePlayer({ scenario, step }: Props) {
  const s = scenario.steps[step];

  return (
    <View style={styles.wrap}>
      <CodeBlock
        code={scenario.whileCode}
        highlightLines={s.whileLines}
        iteration={s.whileIteration}
        entered={s.whileEntered}
        label="while"
      />

      <View style={styles.divider} />

      <CodeBlock
        code={scenario.doWhileCode}
        highlightLines={s.doWhileLines}
        iteration={s.doWhileIteration}
        entered={s.doWhileEntered}
        label="do-while"
      />

      <View style={styles.annotationBox}>
        <Text style={styles.annotationText}>{s.annotation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 42,
  },
  block: {},
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    backgroundColor: 'rgba(46,213,115,0.12)',
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
    backgroundColor: 'rgba(46,213,115,0.18)',
  },
  codeText: {
    color: Colors.codeText,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  codeTextActive: {
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  annotationBox: {
    backgroundColor: Colors.bgTertiary,
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
  },
  annotationText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
