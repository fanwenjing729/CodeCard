import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
import type { BreakContinueScenario } from '@/types';
import CodeBlock from './shared/CodeBlock';

interface Props {
  scenario: BreakContinueScenario;
  step: number;
}

export default function BreakContinuePlayer({ scenario, step }: Props) {
  const s = scenario.steps[step];

  return (
    <View style={styles.wrap}>
      <CodeBlock
        code={scenario.breakCode}
        highlightLines={s.breakLines}
        iteration={s.breakIteration}
        entered={s.breakEntered}
        label="break"
      />

      <View style={styles.divider} />

      <CodeBlock
        code={scenario.continueCode}
        highlightLines={s.continueLines}
        iteration={s.continueIteration}
        entered={s.continueEntered}
        label="continue"
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  annotationBox: {
    backgroundColor: Colors.bgTertiary,
    borderRadius: 8,
    padding: 10,
    marginTop: 57,
  },
  annotationText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
