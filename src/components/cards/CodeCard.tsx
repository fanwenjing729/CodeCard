import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors, useColors, FontSize, FontFamily } from '@/theme';
import type { CodeContent } from '@/types';

interface Props {
  content: CodeContent;
}

export default function CodeCard({ content }: Props) {
  const C = useColors();
  const lines = content.code.split(/\r?\n/);
  const highlightSet = new Set(content.highlights ?? []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.bg }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: C.text }]}>{content.title}</Text>
      <View style={[styles.codeBlock, { backgroundColor: C.codeBg }]}>
        {lines.map((line, i) => (
          <View
            key={i}
            style={[
              styles.line,
              highlightSet.has(i) && [styles.highlightedLine, { backgroundColor: C.codeHighlightBg, borderLeftColor: C.primary }],
            ]}
          >
            <Text style={[styles.lineNum, { color: C.codeLineNum }]}>{i + 1}</Text>
            <Text style={[styles.code, { color: C.codeText }]}>{line || ' '}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: FontFamily.sansBold,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  codeBlock: {
    backgroundColor: Colors.codeBg,
    borderRadius: 12,
    padding: 16,
  },
  line: {
    flexDirection: 'row',
  },
  highlightedLine: {
    backgroundColor: Colors.codeHighlightBg,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  lineNum: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: Colors.codeLineNum,
    width: 24,
    marginRight: 8,
    textAlign: 'right',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: FontSize.code,
    lineHeight: 19,
    color: Colors.codeText,
    flex: 1,
  },
});
