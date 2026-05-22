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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/authStore';
import { manualSync } from '@/store/syncEngine';
import { courses } from '@/data/courses';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { version } from '../../package.json';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const coursesState = useProgressStore((s) => s.courses);
  const resetCourse = useProgressStore((s) => s.resetCourse);
  const flush = useProgressStore((s) => s.flush);

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const setDisplayId = useAuthStore((s) => s.setDisplayId);

  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDisplayId, setEditingDisplayId] = useState('');

  const handleResetCourse = (courseId: string, title: string) => {
    Alert.alert(
      `重置 ${title}`,
      `确定要清除 ${title} 的所有学习进度吗？此操作不可撤销。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '重置',
          style: 'destructive',
          onPress: () => {
            resetCourse(courseId);
            flush();
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      '清空全部数据',
      '确定要清除所有学科的全部学习进度吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '全部清除',
          style: 'destructive',
          onPress: () => {
            courses.forEach((c) => resetCourse(c.id));
            flush();
          },
        },
      ],
    );
  };

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

  const hasProgress = courses.some((c) => {
    const p = coursesState[c.id];
    return p && p.completedCards.length > 0;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      {/* 头像区域 */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          onPress={() => {
            if (!isLoggedIn) navigation.navigate('Login');
          }}
          activeOpacity={isLoggedIn ? 1 : 0.7}
        >
          <View style={styles.avatarCircle}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="account" size={52} color="#ccc" />
            )}
          </View>
        </TouchableOpacity>

        {isLoggedIn ? (
          <>
            <TouchableOpacity onPress={openEditDisplayId} activeOpacity={0.6}>
              <View style={styles.displayIdRow}>
                <Text style={styles.displayIdText} numberOfLines={1}>
                  {user?.displayId || '设置用户名'}
                </Text>
                <MaterialCommunityIcons name="pencil" size={14} color="#999" />
              </View>
            </TouchableOpacity>
            <Text style={styles.phoneText}>{user?.phone ?? user?.name ?? ''}</Text>

            <Text style={styles.syncText}>上次同步：{lastSync ? formatTime(lastSync) : '暂未同步'}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSync}
                disabled={syncing}
                activeOpacity={0.7}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color="#4a9eff" />
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
            <Text style={styles.notLoggedInText}>未登录</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>登录以同步进度</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 编辑 displayId 弹窗 */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>修改用户名</Text>
            <TextInput
              style={styles.modalInput}
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
                <Text style={styles.modalButtonCancel}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmEditDisplayId}
              >
                <Text style={styles.modalButtonConfirmText}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 重置课程进度 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>重置课程进度</Text>

        {courses.map((c) => {
          const progress = coursesState[c.id];
          const completed = progress?.completedCards?.length ?? 0;
          return (
            <TouchableOpacity
              key={c.id}
              style={styles.row}
              onPress={() => handleResetCourse(c.id, c.title)}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.dot, { backgroundColor: c.color }]} />
                <Text style={styles.rowText}>
                  {c.title}
                  {completed > 0 ? `（${completed} 张已完成）` : ''}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 危险操作 */}
      {hasProgress ? (
        <View style={styles.dangerSection}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>危险操作</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Text style={[styles.rowText, styles.dangerText]}>清空全部数据</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>版本</Text>
          <Text style={styles.rowValue}>CodeCard v{version}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dangerSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffccd5',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  dangerTitle: {
    color: '#ff4757',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  rowText: {
    fontSize: 16,
    color: '#222',
  },
  rowValue: {
    fontSize: 14,
    color: '#999',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  dangerText: {
    color: '#ff4757',
  },

  // 头像区域
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eee',
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
    marginTop: 14,
    gap: 6,
  },
  displayIdText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    maxWidth: 220,
  },
  phoneText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  syncText: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4a9eff',
  },
  actionButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff4757',
  },
  actionButtonOutlineText: {
    fontSize: 15,
    color: '#ff4757',
    fontWeight: '600',
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 14,
  },
  loginButton: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#4a9eff',
  },
  loginButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },

  // 编辑弹窗
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: 280,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: '#4a9eff',
  },
  modalButtonCancel: {
    fontSize: 16,
    color: '#999',
  },
  modalButtonConfirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
