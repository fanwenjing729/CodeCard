import { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  Alert, Image, Modal, TextInput,
} from 'react-native';
import { Colors, useColors, FontFamily, Spacing, Radius } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ScreenHeader from '@/components/shared/ScreenHeader';
import { useAuthStore } from '@/store/authStore';
import * as ImagePicker from 'expo-image-picker';

export default function AccountScreen() {
  const C = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = useAuthStore((s) => s.user);
  const updateAvatar = useAuthStore((s) => s.updateAvatar);
  const setDisplayId = useAuthStore((s) => s.setDisplayId);
  const logout = useAuthStore((s) => s.logout);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDisplayId, setEditingDisplayId] = useState('');

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相册权限', '请在系统设置中允许访问相册');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateAvatar(result.assets[0].uri);
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

  const handleLogout = () => {
    Alert.alert('退出登录', '退出后学习数据保留在本地，不会丢失。', [
      { text: '取消', style: 'cancel' },
      { text: '退出', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: C.bgTertiary }]}>
        <ScreenHeader
          onBack={() => navigation.goBack()}
          backLabel="返回"
          variant="compact"
        />
        <View style={styles.empty}>
          <MaterialCommunityIcons name="account-off-outline" size={48} color={C.arrow} />
          <Text style={[styles.emptyText, { color: C.textMuted }]}>未登录</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.bgTertiary }]}>
      <ScreenHeader
        onBack={() => navigation.goBack()}
        backLabel="返回"
        variant="compact"
      />

      {/* 头像 */}
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.7}>
          <View style={[styles.avatarCircle, { backgroundColor: C.border }]}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="account" size={56} color={C.arrow} />
            )}
            <View style={[styles.avatarBadge, { backgroundColor: C.primary }]}>
              <MaterialCommunityIcons name="camera-plus-outline" size={14} color={C.textInverse} />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={[styles.avatarHint, { color: C.textMuted }]}>点击更换头像</Text>
      </View>

      {/* 用户名 */}
      <View style={[styles.section, { backgroundColor: C.bg }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={openEditDisplayId}
          activeOpacity={0.6}
        >
          <Text style={[styles.rowLabel, { color: C.text }]}>用户名</Text>
          <View style={styles.rowRight}>
            <Text style={[styles.rowValue, { color: C.textSecondary }]} numberOfLines={1}>
              {user.displayId || '未设置'}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={C.arrow} />
          </View>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: C.border }]} />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: C.text }]}>绑定方式</Text>
          <Text style={[styles.rowValue, { color: C.textSecondary }]}>
            {user.phone ? `手机号 ${user.phone}` : user.email ? `邮箱 ${user.email}` : '未绑定'}
          </Text>
        </View>
      </View>

      {/* 退出登录 */}
      <View style={[styles.section, { backgroundColor: C.bg }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={handleLogout}
          activeOpacity={0.6}
        >
          <Text style={[styles.rowLabel, { color: C.danger }]}>退出登录</Text>
        </TouchableOpacity>
      </View>

      {/* 编辑用户名弹窗 */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: Colors.textMuted, marginTop: 12 },
  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 100, height: 100 },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarHint: { fontSize: 13, color: Colors.textMuted, marginTop: 10 },
  section: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  rowLabel: { fontSize: 16, flex: 1 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 15, maxWidth: 160, marginRight: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.lg },
  // 弹窗（复用 SettingsScreen 样式模式）
  modalBackdrop: {
    flex: 1, backgroundColor: Colors.backdrop,
    justifyContent: 'center', alignItems: 'center',
  },
  modalCard: {
    backgroundColor: Colors.bg,
    borderRadius: 14, padding: Spacing.xxl, width: 280,
  },
  modalTitle: {
    fontSize: 17, fontWeight: '600', color: Colors.text,
    textAlign: 'center', marginBottom: Spacing.lg,
  },
  modalInput: {
    borderWidth: 1, borderColor: Colors.inputBorder,
    borderRadius: Radius.md, paddingHorizontal: Spacing.base,
    paddingVertical: 10, fontSize: 16, color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row', marginTop: 18, gap: Spacing.md,
  },
  modalButton: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.md, alignItems: 'center',
  },
  modalButtonConfirm: { backgroundColor: Colors.primary },
  modalButtonCancel: { fontSize: 16, color: Colors.textMuted },
  modalButtonConfirmText: { fontSize: 16, color: Colors.textInverse, fontWeight: '600' },
});
