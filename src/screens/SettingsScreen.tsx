import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Switch,
} from 'react-native';
import { Colors, useColors, useTheme, FontFamily, Spacing, Radius } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import { manualSync } from '@/store/syncEngine';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';

const version = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const C = useColors();
  const { isDark, toggle: toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    try {
      const result = await manualSync(user.id);
      setLastSync(result.lastSyncedAt);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bgTertiary }}>
      {/* 右上角账户按钮 */}
      <TouchableOpacity
        style={[styles.accountBtn, { top: insets.top + 16 }]}
        onPress={() => navigation.navigate(isLoggedIn ? 'Account' : 'Login')}
        activeOpacity={0.7}
      >
        <Text style={[styles.accountBtnText, { color: C.primary }]}>账户</Text>
      </TouchableOpacity>

      <ScrollView style={[styles.container, { backgroundColor: C.bgTertiary }]} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      {/* 头像区域 */}
      <LinearGradient
        colors={[C.bgTertiary, C.bg, C.bgTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.avatarSection}
      >
        <TouchableOpacity
          onPress={() => {
            if (!isLoggedIn) navigation.navigate('Login');
          }}
          activeOpacity={isLoggedIn ? 1 : 0.7}
        >
          <View style={[styles.avatarCircle, { backgroundColor: C.border }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="account" size={52} color={C.arrow} />
            )}
          </View>
        </TouchableOpacity>

        {isLoggedIn ? (
          <>
            <Text style={[styles.displayName, { color: C.text }]} numberOfLines={1}>
              {user?.displayId || '未设置用户名'}
            </Text>
            <Text style={[styles.phoneText, { color: C.textMuted }]}>{user?.phone ?? user?.email ?? user?.name ?? ''}</Text>

            <Text style={[styles.syncText, { color: C.textPlaceholder }]}>上次同步：{lastSync ? formatTime(lastSync) : '暂未同步'}</Text>

            <TouchableOpacity
              style={[styles.syncBtn, { backgroundColor: C.primary }]}
              onPress={handleSync}
              disabled={syncing}
              activeOpacity={0.7}
            >
              {syncing ? (
                <ActivityIndicator size="small" color={C.textInverse} />
              ) : (
                <Text style={styles.syncBtnText}>立即同步</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.notLoggedInText, { color: C.disabledText }]}>未登录</Text>
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: C.primary }]}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>登录以同步进度</Text>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>

      {/* 数据管理 */}
      <View style={[styles.section, { backgroundColor: C.bg }]}>
        <TouchableOpacity
          style={styles.entryRow}
          onPress={() => navigation.navigate('Data')}
          activeOpacity={0.7}
        >
          <Text style={[styles.entryText, { color: C.text }]}>数据管理</Text>
          <Text style={[styles.entryArrow, { color: C.arrow }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 关于 */}
      <View style={[styles.section, { backgroundColor: C.bg }]}>
        <Text style={[styles.sectionTitle, { color: C.textMuted }]}>关于</Text>
        <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: C.border }]}>
          <Text style={[styles.rowText, { color: C.text }]}>深色模式</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: C.progressBarBg, true: C.primary }}
            thumbColor={C.bg}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowText, { color: C.text }]}>版本</Text>
          <Text style={[styles.rowValue, { color: C.textMuted }]}>CodeCard v{version}</Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

function formatTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const styles = StyleSheet.create({
  accountBtn: {
    position: 'absolute', right: 16, zIndex: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  accountBtnText: {
    fontSize: 15, fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgTertiary,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  rowText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  entryText: {
    fontSize: 16,
    color: Colors.text,
  },
  entryArrow: {
    fontSize: 22,
    color: Colors.arrow,
  },

  // 头像区域
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.sm,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 96,
    height: 96,
  },
  displayName: {
    fontFamily: FontFamily.sansBold,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: 220,
    marginTop: Spacing.base,
  },
  phoneText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  syncText: {
    fontSize: 13,
    color: Colors.textPlaceholder,
    marginTop: Spacing.md,
  },
  syncBtn: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
  },
  syncBtnText: {
    fontSize: 15,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  notLoggedInText: {
    fontSize: 16,
    color: Colors.disabledText,
    marginTop: Spacing.base,
  },
  loginButton: {
    marginTop: Spacing.base,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
  },
  loginButtonText: {
    fontSize: 15,
    color: Colors.textInverse,
    fontWeight: '600',
  },

});
