import { Fragment, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Colors, Spacing, Radius } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useProgressStore } from '@/store/useProgressStore';
import { courses } from '@/data/courses';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import ScreenHeader from '@/components/shared/ScreenHeader';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DataScreen() {
  const navigation = useNavigation<Nav>();
  const coursesState = useProgressStore((s) => s.courses);
  const resetCourse = useProgressStore((s) => s.resetCourse);
  const flush = useProgressStore((s) => s.flush);

  // ---- confirm modal state ----
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmLabel, setConfirmLabel] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const showConfirm = (title: string, message: string, label: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmLabel(label);
    setConfirmAction(() => action);
    setConfirmVisible(true);
  };

  const hasProgress = courses.some((c) => {
    const p = coursesState[c.id];
    return p && Object.keys(p.completedCards).length > 0;
  });

  const handleResetCourse = (courseId: string, title: string) => {
    showConfirm(
      `重置 ${title}`,
      `确定要清除 ${title} 的所有学习进度吗？此操作不可撤销。`,
      '重置',
      () => {
        resetCourse(courseId);
        flush();
      },
    );
  };

  const handleClearAll = () => {
    showConfirm(
      '清空全部数据',
      '确定要清除所有学科的全部学习进度吗？此操作不可撤销。',
      '全部清除',
      () => {
        courses.forEach((c) => resetCourse(c.id));
        flush();
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="数据管理" backLabel="设置" onBack={() => navigation.goBack()} variant="default" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          {courses.map((c, i) => {
            const progress = coursesState[c.id];
            const completed = Object.keys(progress?.completedCards ?? {}).length;
            return (
              <Fragment key={c.id}>
                {i > 0 && <View style={styles.separator} />}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleResetCourse(c.id, c.title)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.rowIconBox, { backgroundColor: c.color }]}>
                    {c.icon ? (
                      <MaterialCommunityIcons name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={18} color={Colors.textInverse} />
                    ) : (
                      <Text style={styles.rowIconText}>{c.title[0]}</Text>
                    )}
                  </View>
                  <Text style={styles.rowText}>
                    {c.title}
                    {completed > 0 ? `（${completed} 张已完成）` : ''}
                  </Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              </Fragment>
            );
          })}

          {hasProgress && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.row}
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <View style={styles.dangerRowLeft}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={20} color={Colors.danger} />
                  <Text style={[styles.rowText, styles.dangerText]}>清空全部数据</Text>
                </View>
                <Text style={[styles.arrow, styles.dangerArrow]}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Confirm modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{confirmTitle}</Text>
            <Text style={styles.modalMessage}>{confirmMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirmBtn]}
                onPress={() => {
                  setConfirmVisible(false);
                  confirmAction();
                }}
              >
                <Text style={styles.modalConfirmText}>{confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  rowIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  rowIconText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
  rowText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: Colors.arrow,
  },
  dangerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  dangerText: {
    color: Colors.danger,
  },
  dangerArrow: {
    fontSize: 18,
    color: Colors.danger,
  },

  // Confirm modal
  backdrop: {
    flex: 1,
    backgroundColor: Colors.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    width: 280,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  modalConfirmBtn: {
    backgroundColor: Colors.danger,
  },
  modalConfirmText: {
    fontSize: 16,
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
