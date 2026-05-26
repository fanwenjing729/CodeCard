import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, useColors } from '@/theme';

interface Props {
  title: string;
  subtitle: string;
  status: 'pending' | 'started' | 'done';
  themeColor: string;
  onPress?: () => void;
  note?: string;
}

export default function ListItem({ title, subtitle, status, themeColor, onPress, note }: Props) {
  const C = useColors();
  const isDone = status === 'done';
  const isStarted = status === 'started';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: C.bgSecondary, borderColor: C.border },
        isDone && { borderColor: themeColor + '40', backgroundColor: themeColor + '08' },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isDone ? C.success : isStarted ? themeColor : C.arrow },
            isDone && { width: 22, height: 22, borderRadius: 11, marginRight: 4 },
          ]}
        >
          {isDone && <Text style={[styles.check, { color: C.textInverse }]}>✓</Text>}
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: C.text }, isDone && { color: C.textMuted }]}>{title}</Text>
            {note != null && (
              <View style={[styles.noteBadge, { backgroundColor: C.warning + '18' }]}>
                <Text style={[styles.noteText, { color: C.warning }]}>{note}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>{subtitle}</Text>
        </View>
      </View>
      <Text style={[styles.arrow, { color: C.arrow }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  noteBadge: {
    backgroundColor: Colors.warning + '18',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noteText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.warning,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    color: Colors.arrow,
    fontWeight: '300',
  },
});
