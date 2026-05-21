import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressStore } from '../store/useProgressStore';
import { courses } from '../data/courses';

// ============================================================
// 扩展口 #1：登录后在此 import authStore
// import { useAuthStore } from '../store/authStore';
// ============================================================

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const coursesState = useProgressStore((s) => s.courses);
  const resetCourse = useProgressStore((s) => s.resetCourse);
  const flush = useProgressStore((s) => s.flush);

  // ============================================================
  // 扩展口 #2：登录后在此读取用户信息
  // const user = useAuthStore((s) => s.user);
  // const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  // ============================================================

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
            useProgressStore.setState({
              global: { totalXP: 0, level: 1 },
              courses: {},
            });
            flush();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      {/* ============================================================
           扩展口 #3：登录后在此区块上方插入 Profile Section
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>账号</Text>
             <View style={styles.profileRow}>
               <Image source={{ uri: user.avatar }} style={styles.avatar} />
               <View>
                 <Text style={styles.profileName}>{user.name}</Text>
                 <Text style={styles.profileId}>UID: {user.id}</Text>
               </View>
             </View>
             <TouchableOpacity style={styles.row} onPress={...}>
               <Text style={styles.rowText}>修改密码</Text>
               <Text style={styles.arrow}>›</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.row} onPress={handleLogout}>
               <Text style={[styles.rowText, styles.dangerText]}>退出登录</Text>
             </TouchableOpacity>
           </View>
           ============================================================ */}

      {/* ============================================================
           扩展口 #4：登录后在此区块上方插入 Sync Section
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>同步</Text>
             <Text style={styles.syncStatus}>上次同步：2026-05-21 14:30</Text>
             <TouchableOpacity style={styles.row} onPress={syncNow}>
               <Text style={styles.rowText}>立即同步</Text>
             </TouchableOpacity>
           </View>
           ============================================================ */}

      {/* 数据管理 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据管理</Text>

        {courses.map((c) => {
          const progress = coursesState[c.id];
          // 扩展口 #5：已登录时，在 label 上加同步图标
          // const synced = isLoggedIn ? ' ☁️' : '';
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
                  重置{c.title}进度（{progress?.completedCards?.length ?? 0} 张已完成）
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
  // ============================================================
  // 扩展口 #6：登录后使用的样式（取消注释）
  // profileRow: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  // avatar: {
  //   width: 48,
  //   height: 48,
  //   borderRadius: 24,
  //   marginRight: 12,
  // },
  // profileName: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   color: '#222',
  // },
  // profileId: {
  //   fontSize: 13,
  //   color: '#999',
  //   marginTop: 2,
  // },
  // syncStatus: {
  //   fontSize: 13,
  //   color: '#999',
  //   marginBottom: 8,
  // },
  // ============================================================
});
