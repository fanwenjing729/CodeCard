import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { Colors, useColors, useTheme, FontFamily, Gradient, Spacing, Radius } from '@/theme';
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
  const setDisplayId = useAuthStore((s) => s.setDisplayId);

  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDisplayId, setEditingDisplayId] = useState('');

  const handleLogout = () => {
    Alert.alert('退出登录', '退出后学习数据保留在本地，不会丢失。', [
      { text: '取消', style: 'cancel' },
      {
        text: '退出',
        style: 'destructive',
        onPress: () => useAuthStore.getState().logout(),
      },
    ]);
  };

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

  const openEditDisplayId = () => {
    setEditingDisplayId(user?.displayId ?? '');
    setEditModalVisible(true);
  };

  const confirmEditDisplayId = () => {
    setDisplayId(editingDisplayId.trim());
    setEditModalVisible(false);
  };

  return (
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
            <TouchableOpacity onPress={openEditDisplayId} activeOpacity={0.6}>
              <View style={styles.displayIdRow}>
                <Text style={[styles.displayIdText, { color: C.text }]} numberOfLines={1}>
                  {user?.displayId || '设置用户名'}
                </Text>
                <MaterialCommunityIcons name="pencil" size={14} color={C.textMuted} />
              </View>
            </TouchableOpacity>
            <Text style={[styles.phoneText, { color: C.textMuted }]}>{user?.phone ?? user?.email ?? user?.name ?? ''}</Text>

            <Text style={[styles.syncText, { color: C.textPlaceholder }]}>上次同步：{lastSync ? formatTime(lastSync) : '暂未同步'}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: C.primary }]}
                onPress={handleSync}
                disabled={syncing}
                activeOpacity={0.7}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color={C.textInverse} />
                ) : (
                  <Text style={styles.actionButtonText}>立即同步</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonOutline]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonOutlineText}>退出登录</Text>
              </TouchableOpacity>
            </View>
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

      {/* 编辑 displayId 弹窗 */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { backgroundColor: C.backdrop }]}>
          <View style={[styles.modalCard, { backgroundColor: C.bg }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>修改用户名</Text>
            <TextInput
              style={[styles.modalInput, { color: C.text, borderColor: C.inputBorder }]}
              value={editingDisplayId}
              onChangeText={setEditingDisplayId}
              placeholder="输入用户名"
              maxLength={20}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.modalButtonCancel, { color: C.textMuted }]}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm, { backgroundColor: C.primary }]}
                onPress={confirmEditDisplayId}
              >
                <Text style={styles.modalButtonConfirmText}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  );
}

function formatTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const styles = StyleSheet.create({
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
  displayIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.base,
    gap: 6,
  },
  displayIdText: {
    fontFamily: FontFamily.sansBold,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: 220,
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
  actionRow: {
    flexDirection: 'row',
    marginTop: Spacing.base,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 15,
    color: Colors.textInverse,
    fontWeight: '600',
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  actionButtonOutlineText: {
    fontSize: 15,
    color: Colors.danger,
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

  // 编辑弹窗
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: Colors.bg,
    borderRadius: 14,
    padding: Spacing.xxl,
    width: 280,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 18,
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: Colors.primary,
  },
  modalButtonCancel: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  modalButtonConfirmText: {
    fontSize: 16,
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
