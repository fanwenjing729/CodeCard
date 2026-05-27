import { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors, useColors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { loginByPhone, verifyOtp, loginByWechat, isLoggedIn } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ contentStyle: { backgroundColor: C.bgTertiary } });
  }, [navigation, C.bgTertiary]);

  // 登录成功后自动返回
  if (isLoggedIn) {
    navigation.goBack();
    return null;
  }

  const startCountdown = useCallback(() => {
    setCountdown(60);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 11) {
      Alert.alert('请输入正确的手机号');
      return;
    }
    setSending(true);
    const { error } = await loginByPhone(phone);
    setSending(false);
    if (error) {
      Alert.alert('发送失败', error);
      return;
    }
    startCountdown();
  };

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('请输入验证码');
      return;
    }
    setVerifying(true);
    const { error } = await verifyOtp(phone, otp);
    setVerifying(false);
    if (error) {
      Alert.alert('验证失败', error);
    }
    // 成功后 isLoggedIn 会自动触发 goBack
  };

  const handleWechat = async () => {
    const { error } = await loginByWechat();
    if (error) {
      Alert.alert('微信登录失败', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, backgroundColor: C.bgTertiary }]}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.6}
      >
        <MaterialCommunityIcons name="close" size={24} color={C.textSecondary} />
      </TouchableOpacity>

      <View style={styles.body}>
        <MaterialCommunityIcons name="account-circle-outline" size={64} color={C.arrow} />
        <Text style={[styles.title, { color: C.text }]}>登录</Text>
        <Text style={[styles.subtitle, { color: C.textMuted }]}>登录后可跨设备同步学习进度</Text>

        {/* 手机号输入 */}
        <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
          <Text style={[styles.prefix, { color: C.textSecondary }]}>+86</Text>
          <TextInput
            style={[styles.input, { color: C.text }]}
            placeholder="手机号"
            placeholderTextColor={C.textPlaceholder}
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* 验证码输入 */}
        <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
          <TextInput
            style={[styles.input, { color: C.text }]}
            placeholder="验证码"
            placeholderTextColor={C.textPlaceholder}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            style={[styles.otpBtn, { backgroundColor: countdown > 0 ? C.disabledBg : C.primary }]}
            onPress={handleSendOtp}
            disabled={countdown > 0 || sending}
            activeOpacity={0.7}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.otpBtnText}>
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 登录按钮 */}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: C.primary }]}
          onPress={handleVerify}
          disabled={verifying}
          activeOpacity={0.8}
        >
          {verifying ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>登录</Text>
          )}
        </TouchableOpacity>

        {/* 分割线 */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
          <Text style={[styles.dividerText, { color: C.textMuted }]}>或</Text>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
        </View>

        {/* 微信登录 */}
        <TouchableOpacity
          style={[styles.wechatBtn, { borderColor: '#07C160' }]}
          onPress={handleWechat}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="wechat" size={20} color="#07C160" />
          <Text style={styles.wechatBtnText}>微信登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: { alignSelf: 'flex-end', padding: 16 },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 32, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: '600', marginTop: 16 },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 8, marginBottom: 32 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', height: 48,
    borderWidth: 1, borderRadius: 10,
    marginBottom: 12, paddingHorizontal: 14,
  },
  prefix: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  otpBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  otpBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  loginBtn: {
    width: '100%', height: 48, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, marginHorizontal: 12 },
  wechatBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', height: 48, borderRadius: 10, borderWidth: 1.5, gap: 8,
  },
  wechatBtnText: { fontSize: 15, fontWeight: '600', color: '#07C160' },
});
