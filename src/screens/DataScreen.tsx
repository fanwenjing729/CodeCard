import { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Colors, Spacing, Radius } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useProgressStore, XP_PER_CARD, XP_PER_PRACTICE } from '@/store/useProgressStore';
import { useCourses, getCourse, getCourses } from '@/lib/useCourses';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { CourseModule, PathNode } from '@/types';
import ScreenHeader from '@/components/shared/ScreenHeader';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// --------------- view state ---------------

type DataView =
  | { level: 'courses' }
  | { level: 'modules'; courseId: string }
  | { level: 'nodes'; courseId: string; moduleId: string };

// --------------- helpers ---------------

function buildCardTypeMap() {
  const map = new Map<string, 'concept' | 'code' | 'animation' | 'practice'>();
  for (const c of getCourses()) {
    for (const n of c.nodes) {
      for (const card of n.cards) {
        map.set(card.id, card.cardType);
      }
    }
  }
  return map;
}

function calcXPToSubtract(
  completedCards: Record<string, true>,
  cardIds: string[],
  cardTypeMap: Map<string, 'concept' | 'code' | 'animation' | 'practice'>,
): number {
  let xp = 0;
  for (const cid of cardIds) {
    if (cid in completedCards) {
      const t = cardTypeMap.get(cid);
      xp += t === 'practice' ? XP_PER_PRACTICE : XP_PER_CARD;
    }
  }
  return xp;
}

// --------------- component ---------------

export default function DataScreen() {
  const navigation = useNavigation<Nav>();
  const coursesState = useProgressStore((s) => s.courses);
  const resetCourse = useProgressStore((s) => s.resetCourse);
  const removeCompletedCards = useProgressStore((s) => s.removeCompletedCards);
  const flush = useProgressStore((s) => s.flush);

  const [view, setView] = useState<DataView>({ level: 'courses' });
  const courses = useCourses();

  const cardTypeMap = useMemo(() => buildCardTypeMap(), []);

  // ---- confirm modal ----
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

  // ---- computed data based on view ----

  const headerTitle = (() => {
    if (view.level === 'courses') return '数据管理';
    const c = getCourse(view.courseId);
    if (view.level === 'modules') return c?.title ?? '';
    return c?.modulesMeta.find((m) => m.moduleId === view.moduleId)?.module ?? '';
  })();

  const headerBackLabel = (() => {
    if (view.level === 'courses') return '设置';
    if (view.level === 'modules') return '数据管理';
    return getCourse(view.courseId)?.title ?? '';
  })();

  // ---- reset handlers ----

  const handleResetCourse = (courseId: string, title: string) => {
    showConfirm(`重置 ${title}`, `确定要清除 ${title} 的全部学习进度吗？此操作不可撤销。`, '重置', () => {
      resetCourse(courseId);
      flush();
    });
  };

  const handleResetModule = (courseId: string, moduleId: string, moduleName: string) => {
    const course = getCourse(courseId);
    if (!course) return;
    const nodes = course.nodes.filter((n) => n.moduleId === moduleId);
    const cardIds = nodes.flatMap((n) => n.cards.map((card) => card.id));
    const progress = coursesState[courseId];
    const completed = progress?.completedCards ?? {};
    const xp = calcXPToSubtract(completed, cardIds, cardTypeMap);
    const completedCount = cardIds.filter((id) => id in completed).length;

    showConfirm(
      `重置 ${moduleName}`,
      `确定要清除「${moduleName}」模块的学习进度吗？\n已完成 ${completedCount} 张卡片将全部清除。此操作不可撤销。`,
      '重置',
      () => {
        removeCompletedCards(courseId, cardIds, xp);
        flush();
      },
    );
  };

  const handleResetNode = (courseId: string, node: PathNode) => {
    const cardIds = node.cards.map((c) => c.id);
    const progress = coursesState[courseId];
    const completed = progress?.completedCards ?? {};
    const xp = calcXPToSubtract(completed, cardIds, cardTypeMap);
    const completedCount = cardIds.filter((id) => id in completed).length;

    showConfirm(
      `重置 ${node.title}`,
      `确定要清除「${node.title}」节点的学习进度吗？\n已完成 ${completedCount} 张卡片将全部清除。此操作不可撤销。`,
      '重置',
      () => {
        removeCompletedCards(courseId, cardIds, xp);
        flush();
      },
    );
  };

  const handleClearAll = () => {
    showConfirm('清空全部数据', '确定要清除所有学科的全部学习进度吗？此操作不可撤销。', '全部清除', () => {
      courses.forEach((c) => resetCourse(c.id));
      flush();
    });
  };

  // ---- helper: count completed cards ----

  const countCompleted = (courseId: string, cardIds: string[]) => {
    const completed = coursesState[courseId]?.completedCards ?? {};
    return cardIds.filter((id) => id in completed).length;
  };

  // ---- render items based on view level ----

  const renderCourses = () => {
    const hasProgress = courses.some((c) => {
      const p = coursesState[c.id];
      return p && Object.keys(p.completedCards).length > 0;
    });

    return (
      <>
        {courses.map((c, i) => {
          const allCardIds = c.nodes.flatMap((n) => n.cards.map((card) => card.id));
          const completed = countCompleted(c.id, allCardIds);
          return (
            <View key={c.id}>
              {i > 0 && <View style={styles.separator} />}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.rowMain}
                  onPress={() => setView({ level: 'modules', courseId: c.id })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.rowIconBox, { backgroundColor: c.color }]}>
                    <MaterialCommunityIcons
                      name={c.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={18}
                      color={Colors.textInverse}
                    />
                  </View>
                  <Text style={styles.rowText}>
                    {c.title}
                    {completed > 0 ? `（${completed} 张已完成）` : ''}
                  </Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
                {completed > 0 && (
                  <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={() => handleResetCourse(c.id, c.title)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialCommunityIcons name="refresh" size={18} color={Colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {hasProgress && (
          <>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.row} onPress={handleClearAll} activeOpacity={0.7}>
              <View style={styles.dangerRowLeft}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={Colors.danger} />
                <Text style={[styles.rowText, styles.dangerText]}>清空全部数据</Text>
              </View>
              <Text style={[styles.arrow, styles.dangerArrow]}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };

  const renderModules = (v: Extract<DataView, { level: 'modules' }>) => {
    const course = getCourse(v.courseId)!;
    const modules = course.modulesMeta;

    return modules.map((m, i) => {
      const moduleNodes = course.nodes.filter((n) => n.moduleId === m.moduleId);
      const cardIds = moduleNodes.flatMap((n) => n.cards.map((c) => c.id));
      const completed = countCompleted(course.id, cardIds);
      return (
        <View key={m.moduleId}>
          {i > 0 && <View style={styles.separator} />}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rowMain}
              onPress={() => setView({ level: 'nodes', courseId: course.id, moduleId: m.moduleId })}
              activeOpacity={0.7}
            >
              <View style={[styles.rowIconBox, { backgroundColor: course.color }]}>
                <MaterialCommunityIcons name="folder-outline" size={18} color={Colors.textInverse} />
              </View>
              <Text style={styles.rowText}>
                {m.module}
                {completed > 0 ? `（${completed} 张已完成）` : ''}
              </Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            {completed > 0 && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => handleResetModule(course.id, m.moduleId, m.module)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="refresh" size={18} color={Colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    });
  };

  const renderNodes = (v: Extract<DataView, { level: 'nodes' }>) => {
    const course = getCourse(v.courseId)!;
    const nodes = course.nodes.filter((n) => n.moduleId === v.moduleId);

    return nodes.map((n, i) => {
      const cardIds = n.cards.map((c) => c.id);
      const completed = countCompleted(course.id, cardIds);
      return (
        <View key={n.id}>
          {i > 0 && <View style={styles.separator} />}
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <View style={[styles.rowIconBox, { backgroundColor: course.color }]}>
                <MaterialCommunityIcons name="file-document-outline" size={18} color={Colors.textInverse} />
              </View>
              <Text style={styles.rowText}>
                {n.title}
                {completed > 0 ? `（${completed} 张已完成）` : ''}
              </Text>
            </View>
            {completed > 0 && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => handleResetNode(course.id, n)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons name="refresh" size={18} color={Colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    });
  };

  // ---- main render ----

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={headerTitle}
        backLabel={headerBackLabel}
        onBack={() => {
          if (view.level === 'nodes') {
            setView({ level: 'modules', courseId: view.courseId });
          } else if (view.level === 'modules') {
            setView({ level: 'courses' });
          } else {
            navigation.goBack();
          }
        }}
        variant="default"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          {view.level === 'courses' && renderCourses()}
          {view.level === 'modules' && renderModules(view)}
          {view.level === 'nodes' && renderNodes(view)}
        </View>
      </ScrollView>

      {/* Confirm modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{confirmTitle}</Text>
            <Text style={styles.modalMessage}>{confirmMessage}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setConfirmVisible(false)}>
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
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  rowText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: Colors.arrow,
  },
  resetBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
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
