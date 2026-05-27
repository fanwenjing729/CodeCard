import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import { Colors, useColors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp, setPassword } = useAuthStore();

  type AuthType = 'email' | 'phone';
  const [authType, setAuthType] = useState<AuthType>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 两步：Step 1 = 邮箱 + 验证码，Step 2 = 设密码
  const [step, setStep] = useState(1);
  const [password, setPasswordLocal] = useState('');
  const [confirmPassword, setConfirmPasswordLocal] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({ contentStyle: { backgroundColor: C.bgTertiary } });
  }, [navigation, C.bgTertiary]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

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

  const validate = (): string | null => {
    if (authType === 'email') {
      const t = email.trim().toLowerCase();
      if (!t || !t.includes('@')) {
        Alert.alert('请输入正确的邮箱地址');
        return null;
      }
      return t;
    }
    const p = phone.trim();
    if (!p || p.length < 11) {
      Alert.alert('请输入正确的手机号（如 +8613800138000）');
      return null;
    }
    return p;
  };

  // ── Step 1：发送验证码 ──
  const handleSendCode = async () => {
    const v = validate();
    if (!v) return;
    setSending(true);
    const fn = authType === 'email' ? sendEmailOtp : sendPhoneOtp;
    const { error } = await fn(v);
    setSending(false);
    if (error) {
      Alert.alert('发送失败', error);
      return;
    }
    startCountdown();
  };

  // ── Step 1：验证验证码 → 进 Step 2 ──
  const handleVerify = async () => {
    const v = validate();
    if (!v) return;
    if (!code || code.length < 4) {
      Alert.alert('请输入验证码');
      return;
    }
    setLoading(true);
    const fn = authType === 'email' ? verifyEmailOtp : verifyPhoneOtp;
    const { error } = await fn(v, code);
    setLoading(false);
    if (error) {
      Alert.alert('验证失败', error);
      return;
    }
    setStep(2);
  };

  // ── Step 2：设密码完成注册 ──
  const handleSetPassword = async () => {
    if (password.length < 6) {
      Alert.alert('密码至少需要 6 位');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    const { error } = await setPassword(password);
    setLoading(false);
    if (error) {
      Alert.alert('设置密码失败', error);
      return;
    }
    // 注册成功后跳过 LoginScreen，直接回到上一页
    if (navigation.canGoBack()) navigation.pop(2);
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
        <MaterialCommunityIcons name="account-plus-outline" size={64} color={C.arrow} />
        <Text style={[styles.title, { color: C.text }]}>注册</Text>
        <Text style={[styles.subtitle, { color: C.textMuted }]}>
          {step === 1
            ? (authType === 'email' ? '输入邮箱，验证码会自动发送' : '输入手机号，短信验证码会自动发送')
            : '设置登录密码'}
        </Text>

        {/* ═══ Step 1：验证身份 ═══ */}
        {step === 1 && (
          <>
            {/* 邮箱 / 手机号 切换 */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, authType === 'email' && { backgroundColor: C.primary }]}
                onPress={() => setAuthType('email')}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, authType === 'email' && { color: '#fff' }]}>邮箱</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, authType === 'phone' && { backgroundColor: C.primary }]}
                onPress={() => setAuthType('phone')}
                activeOpacity={0.7}
              >
                <Text style={[styles.toggleText, authType === 'phone' && { color: '#fff' }]}>手机号</Text>
              </TouchableOpacity>
            </View>

            {authType === 'email' ? (
              <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
                <TextInput
                  style={[styles.input, { color: C.text }]}
                  placeholder="邮箱"
                  placeholderTextColor={C.textPlaceholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity
                  style={[styles.otpBtn, { backgroundColor: countdown > 0 ? C.disabledBg : C.primary }]}
                  onPress={handleSendCode}
                  disabled={countdown > 0 || sending}
                  activeOpacity={0.7}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.otpBtnText}>
                      {countdown > 0 ? `${countdown}s` : '发送'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
                <TextInput
                  style={[styles.input, { color: C.text }]}
                  placeholder="手机号（如 +8613800138000）"
                  placeholderTextColor={C.textPlaceholder}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  value={phone}
                  onChangeText={setPhone}
                />
                <TouchableOpacity
                  style={[styles.otpBtn, { backgroundColor: countdown > 0 ? C.disabledBg : C.primary }]}
                  onPress={handleSendCode}
                  disabled={countdown > 0 || sending}
                  activeOpacity={0.7}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.otpBtnText}>
                      {countdown > 0 ? `${countdown}s` : '发送'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="验证码"
                placeholderTextColor={C.textPlaceholder}
                keyboardType="number-pad"
                maxLength={8}
                value={code}
                onChangeText={setCode}
              />
            </View>

            <TouchableOpacity
              style={[styles.fullBtn, { backgroundColor: C.primary }]}
              onPress={handleVerify}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>验证</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ═══ Step 2：设密码 ═══ */}
        {step === 2 && (
          <>
            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="密码（至少 6 位）"
                placeholderTextColor={C.textPlaceholder}
                secureTextEntry
                value={password}
                onChangeText={setPasswordLocal}
              />
            </View>

            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="确认密码"
                placeholderTextColor={C.textPlaceholder}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPasswordLocal}
              />
            </View>

            <TouchableOpacity
              style={[styles.fullBtn, { backgroundColor: C.primary }]}
              onPress={handleSetPassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>完成注册</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}
          style={styles.backLink}
        >
          <Text style={[styles.link, { color: C.textMuted }]}>返回登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const btnH = 48;

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: { alignSelf: 'flex-end', padding: 16 },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 32, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: '600', marginTop: 16 },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 8, marginBottom: 32 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    width: '100%', height: btnH,
    borderWidth: 1, borderRadius: 10,
    marginBottom: 12, paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, height: '100%' },
  otpBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  otpBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  fullBtn: {
    width: '100%', height: btnH, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  toggleRow: {
    flexDirection: 'row', width: '100%',
    marginBottom: 12, gap: 10,
  },
  toggleBtn: {
    flex: 1, height: 40, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  toggleText: { fontSize: 14, color: Colors.textMuted },
  link: { fontSize: 14 },
  backLink: { marginTop: 20, paddingVertical: 4 },
});
