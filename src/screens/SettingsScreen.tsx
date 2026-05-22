import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgressStore } from '@/store/useProgressStore';
import { useAuthStore } from '@/store/authStore';
import { manualSync } from '@/store/syncEngine';
import { courses } from '@/data/courses';
import type { RootStackParamList } from '@/navigation/AppNavigator';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const coursesState = useProgressStore((s) => s.courses);
  const resetCourse = useProgressStore((s) => s.resetCourse);
  const flush = useProgressStore((s) => s.flush);

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

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

  const formatSyncTime = (d: Date | null) => {
    if (!d) return '暂未同步';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      {/* 账号 */}
      {isLoggedIn && user ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账号</Text>
          <View style={styles.profileRow}>
            <View>
              <Text style={styles.profileName}>{user.phone ?? user.name ?? '用户'}</Text>
              <Text style={styles.profileId}>UID: {user.id.slice(0, 8)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.row} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={[styles.rowText, styles.dangerText]}>退出登录</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 同步 */}
      {isLoggedIn ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>同步</Text>
          <Text style={styles.syncStatus}>上次同步：{formatSyncTime(lastSync)}</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={handleSync}
            activeOpacity={0.7}
            disabled={syncing}
          >
            <Text style={styles.rowText}>立即同步</Text>
            {syncing ? (
              <ActivityIndicator size="small" color="#4a9eff" />
            ) : (
              <Text style={styles.arrow}>›</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 登录入口（未登录时） */}
      {!isLoggedIn ? (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.rowText}>登录以同步进度</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 数据管理 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据管理</Text>

        {courses.map((c) => {
          const progress = coursesState[c.id];
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
                  重置{c.title}进度（{progress?.completedCards?.length ?? 0} 张已完成）{isLoggedIn ? ' ☁️' : ''}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.row}
          onPress={handleClearAll}
          activeOpacity={0.7}
        >
          <Text style={[styles.rowText, styles.dangerText]}>清空全部数据</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>版本</Text>
          <Text style={styles.rowValue}>CodeCard v1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>技术</Text>
          <Text style={styles.rowValue}>Expo SDK 55 / RN 0.83</Text>
        </View>
      </View>
    </ScrollView>
  );
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
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
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  profileId: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  syncStatus: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
});
