import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, useColors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
  onBack: () => void;
  title?: string;
  center?: React.ReactNode;
  right?: React.ReactNode;
  backLabel?: string;
  themeColor?: string;
  variant: 'default' | 'compact';
}

export default function ScreenHeader({
  onBack,
  title,
  center,
  right,
  backLabel = '返回',
  themeColor = Colors.primary,
  variant,
}: ScreenHeaderProps) {
  const C = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        variant === 'compact' ? [styles.headerCompact, { borderBottomColor: C.border }] : styles.headerDefault,
        { paddingTop: insets.top + (variant === 'compact' ? 33 : 42) },
        variant === 'default' && { borderBottomColor: themeColor + '40' },
      ]}
    >
      <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
        <Text style={[styles.backBtn, variant === 'default' ? { color: themeColor } : { color: C.primary }]}>
          ← {backLabel}
        </Text>
      </TouchableOpacity>

      {title && <Text style={[styles.title, { color: C.text }]}>{title}</Text>}
      {center}

      {right ?? <View style={{ width: 40 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  headerDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    fontSize: 15,
    color: Colors.primary,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
});
