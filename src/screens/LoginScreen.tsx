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

type Mode = 'password' | 'code' | 'reset';

export default function LoginScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    loginByEmail,
    sendEmailOtp, verifyEmailOtp,
    setPassword,
    isLoggedIn,
  } = useAuthStore();

  // 共享
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<Mode>('password');
  const [loading, setLoading] = useState(false);

  // 密码 / 注册
  const [password, setPasswordLocal] = useState('');

  // 验证码 / 重置
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ contentStyle: { backgroundColor: C.bgTertiary } });
  }, [navigation, C.bgTertiary]);

  useEffect(() => {
    if (isLoggedIn) navigation.goBack();
  }, [isLoggedIn]);

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

  const validateEmail = () => {
    const t = email.trim().toLowerCase();
    if (!t || !t.includes('@')) {
      Alert.alert('请输入正确的邮箱地址');
      return null;
    }
    return t;
  };

  // ── 密码模式：登录 ──
  const handleContinue = async () => {
    const e = validateEmail();
    if (!e) return;
    if (password.length < 6) {
      Alert.alert('密码至少需要 6 位');
      return;
    }
    setLoading(true);
    const { error } = await loginByEmail(e, password);
    setLoading(false);
    if (error) Alert.alert('登录失败', error);
  };

  // ── 验证码模式：发送 ──
  const handleSendCode = async () => {
    const e = validateEmail();
    if (!e) return;
    setSending(true);
    const { error } = await sendEmailOtp(e);
    setSending(false);
    if (error) {
      Alert.alert('发送失败', error);
      return;
    }
    startCountdown();
  };

  // ── 验证码模式：验证 ──
  const handleVerifyCode = async () => {
    const e = validateEmail();
    if (!e) return;
    if (!code || code.length < 6) {
      Alert.alert('请输入 6 位验证码');
      return;
    }
    setLoading(true);
    const { error } = await verifyEmailOtp(e, code);
    setLoading(false);
    if (error) Alert.alert('验证失败', error);
  };

  // ── 重置第一步：发验证码 → 进第二步 ──
  const handleResetSend = async () => {
    const e = validateEmail();
    if (!e) return;
    setSending(true);
    const { error } = await sendEmailOtp(e);
    setSending(false);
    if (error) {
      Alert.alert('发送失败', error);
      return;
    }
    setResetStep(2);
    startCountdown();
  };

  // ── 重置第二步：验证码 + 设新密码 ──
  const handleResetConfirm = async () => {
    const e = validateEmail();
    if (!e) return;
    if (!code || code.length < 6) {
      Alert.alert('请输入 6 位验证码');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('新密码至少需要 6 位');
      return;
    }
    setLoading(true);
    const { error: verifyError } = await verifyEmailOtp(e, code);
    if (verifyError) {
      setLoading(false);
      Alert.alert('验证失败', verifyError);
      return;
    }
    const { error: pwError } = await setPassword(newPassword);
    setLoading(false);
    if (pwError) {
      Alert.alert('修改密码失败', pwError);
    }
    // 成功后 isLoggedIn 会触发 goBack
  };

  // ── 模式切换 ──
  const switchMode = (next: Mode) => {
    setMode(next);
    setLoading(false);
    setPasswordLocal('');
    setCode('');
    setNewPassword('');
    setCountdown(0);
    setResetStep(1);
    if (countdownRef.current) clearInterval(countdownRef.current);
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

        {/* 邮箱 */}
        <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
          <TextInput
            style={[styles.input, { color: C.text }]}
            placeholder="邮箱"
            placeholderTextColor={C.textPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!(mode === 'reset' && resetStep === 2)}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* ═══ 密码模式 ═══ */}
        {mode === 'password' && (
          <>
            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="密码"
                placeholderTextColor={C.textPlaceholder}
                secureTextEntry
                value={password}
                onChangeText={setPasswordLocal}
              />
            </View>

            <TouchableOpacity
              style={[styles.fullBtn, { backgroundColor: C.primary }]}
              onPress={handleContinue}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>登录</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ═══ 验证码模式 ═══ */}
        {mode === 'code' && (
          <>
            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="验证码"
                placeholderTextColor={C.textPlaceholder}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
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

            <TouchableOpacity
              style={[styles.fullBtn, { backgroundColor: C.primary }]}
              onPress={handleVerifyCode}
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

        {/* ═══ 重置 Step 1：发验证码 ═══ */}
        {mode === 'reset' && resetStep === 1 && (
          <>
            <TouchableOpacity
              style={[styles.fullBtn, { backgroundColor: C.primary }]}
              onPress={handleResetSend}
              disabled={sending}
              activeOpacity={0.8}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>发送验证码</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ═══ 重置 Step 2：验证码 + 新密码 ═══ */}
        {mode === 'reset' && resetStep === 2 && (
          <>
            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="验证码"
                placeholderTextColor={C.textPlaceholder}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
              />
            </View>

            <View style={[styles.inputRow, { borderColor: C.border, backgroundColor: C.bg }]}>
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="新密码"
                placeholderTextColor={C.textPlaceholder}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.fullBtn, { backgroundColor: C.primary }]}
              onPress={handleResetConfirm}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.btnText}>确认修改</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ── 底部链接 ── */}
        {mode === 'password' && (
          <View style={styles.linkBlock}>
            <TouchableOpacity onPress={() => switchMode('code')} activeOpacity={0.6}>
              <Text style={[styles.link, { color: C.textMuted }]}>验证码登录</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.6}
            >
              <Text style={[styles.link, { color: C.textMuted }]}>注册账号</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => switchMode('reset')} activeOpacity={0.6}>
              <Text style={[styles.link, { color: C.textMuted }]}>忘记密码？</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode !== 'password' && (
          <TouchableOpacity
            onPress={() => switchMode('password')}
            activeOpacity={0.6}
            style={styles.switchLink}
          >
            <Text style={[styles.link, { color: C.textMuted }]}>← 使用密码登录</Text>
          </TouchableOpacity>
        )}
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
  fullBtn: {
    width: '100%', height: btnH, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  otpBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  otpBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  linkBlock: {
    flexDirection: 'row', width: '100%', marginTop: 20,
    justifyContent: 'space-between', paddingHorizontal: 4,
  },
  link: { fontSize: 14 },
  switchLink: { marginTop: 20, paddingVertical: 4 },
});
