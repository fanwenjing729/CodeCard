import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/theme';
import type { WhileDoWhileScenario } from '@/types';
import CodeBlock from './shared/CodeBlock';

interface Props {
  scenario: WhileDoWhileScenario;
  step: number;
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
