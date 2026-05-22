import { StyleSheet, Text, View, ScrollView } from 'react-native';
import type { TextContent } from '@/types';

interface Props {
  content: TextContent;
}

export default function ConceptCard({ content }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.body}>{content.body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
  },
});
