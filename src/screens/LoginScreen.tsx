import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.6}
      >
        <MaterialCommunityIcons name="close" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.body}>
        <MaterialCommunityIcons name="account-circle-outline" size={64} color={Colors.arrow} />
        <Text style={styles.title}>登录</Text>
        <Text style={styles.subtitle}>登录功能即将上线</Text>
        <Text style={styles.hint}>
          届时支持手机号验证码登录和微信登录，{'\n'}
          并可跨设备同步学习进度。
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgTertiary,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 16,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: Colors.textPlaceholder,
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
});
