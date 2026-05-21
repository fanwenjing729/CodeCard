import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  subtitle: string;
  status: 'pending' | 'started' | 'done';
  themeColor: string;
  onPress: () => void;
}

export default function ListItem({ title, subtitle, status, themeColor, onPress }: Props) {
  const isDone = status === 'done';
  const isStarted = status === 'started';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isDone && { borderColor: themeColor + '40', backgroundColor: themeColor + '08' },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isDone ? '#2ed573' : isStarted ? themeColor : '#ccc' },
            isDone && { width: 22, height: 22, borderRadius: 11, marginRight: 4 },
          ]}
        >
          {isDone && <Text style={styles.check}>✓</Text>}
        </View>
        <View>
          <Text style={[styles.title, isDone && { color: '#999' }]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: '#ccc',
    fontWeight: '300',
  },
});
