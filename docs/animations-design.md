# C++ 课程动画设计

> 全部基于 MemoryBox 组件（Reanimated + SVG），只写 scenario 数据即可，不需要新组件。

---

## 0. 最先做的事：搭建动画预览环境

在做任何动画之前，先创建 `AnimationPreviewScreen`，这样每写完一个 scenario 就能立刻看效果，不需要走课程→模块→节点→卡片的完整流程。

### 0.1 创建预览页

文件：`src/screens/AnimationPreviewScreen.tsx`

```tsx
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { animationRegistry, getAnimComponent } from '../data/animations';

type Props = NativeStackScreenProps<RootStackParamList, 'AnimPreview'>;

export default function AnimationPreviewScreen({ navigation, route }: Props) {
  const initialId = route.params?.animationId;
  const animIds = Object.keys(animationRegistry);
  const [selectedId, setSelectedId] = useState(initialId ?? animIds[0] ?? '');
  const [step, setStep] = useState(0);

  const entry = animationRegistry[selectedId];
  const scenario = entry?.scenario;
  const totalSteps = scenario?.steps.length ?? 0;

  if (!entry?.Component) {
    entry?.loadComponent();
  }
  const Comp = entry?.Component;

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>动画预览</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 动画选择器 */}
      <ScrollView horizontal style={styles.picker} contentContainerStyle={styles.pickerContent}>
        {animIds.map((id) => (
          <TouchableOpacity
            key={id}
            style={[styles.pill, id === selectedId && styles.pillActive]}
            onPress={() => { setSelectedId(id); setStep(0); }}
          >
            <Text style={[styles.pillText, id === selectedId && styles.pillTextActive]}>
              {animationRegistry[id].scenario.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 动画区域 */}
      <View style={styles.preview}>
        {Comp && scenario ? (
          <Comp scenario={scenario} step={step} />
        ) : (
          <Text style={styles.empty}>暂无动画</Text>
        )}
      </View>

      {/* 步骤控制 */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, step === 0 && styles.btnDisabled]}
          onPress={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <Text style={styles.btnText}>← 上一步</Text>
        </TouchableOpacity>

        <Text style={styles.stepLabel}>
          {step + 1} / {totalSteps}
          {scenario ? ` — ${scenario.steps[step]?.label ?? ''}` : ''}
        </Text>

        <TouchableOpacity
          style={[styles.btn, step >= totalSteps - 1 && styles.btnDisabled]}
          onPress={() => setStep(Math.min(totalSteps - 1, step + 1))}
          disabled={step >= totalSteps - 1}
        >
          <Text style={styles.btnText}>下一步 →</Text>
        </TouchableOpacity>
      </View>

      {/* 注释 */}
      {scenario && (
        <View style={styles.annotationBox}>
          <Text style={styles.annotationText}>{scenario.steps[step]?.annotation ?? ''}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 64, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: '#333',
  },
  backBtn: { fontSize: 15, color: '#4a9eff' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#eee' },
  picker: { maxHeight: 48, borderBottomWidth: 1, borderBottomColor: '#333' },
  pickerContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: '#2a2a3e', borderWidth: 1, borderColor: '#444',
  },
  pillActive: { backgroundColor: '#4a9eff30', borderColor: '#4a9eff' },
  pillText: { fontSize: 13, color: '#999' },
  pillTextActive: { color: '#4a9eff', fontWeight: '600' },
  preview: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#666', fontSize: 15 },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 16,
  },
  btn: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8,
    backgroundColor: '#4a9eff',
  },
  btnDisabled: { backgroundColor: '#333' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  stepLabel: { color: '#aaa', fontSize: 13, flex: 1, textAlign: 'center' },
  annotationBox: {
    marginHorizontal: 24, marginBottom: 24, padding: 14,
    backgroundColor: '#2a2a3e', borderRadius: 10,
  },
  annotationText: { color: '#ccc', fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
```

### 0.2 注册路由

文件：`src/navigation/AppNavigator.tsx`

改 3 处：

```tsx
// 1. import
import AnimationPreviewScreen from '../screens/AnimationPreviewScreen';

// 2. RootStackParamList 加一条
export type RootStackParamList = {
  ...
  AnimPreview: { animationId?: string } | undefined;
};

// 3. RootStack.Navigator 里加一个 Screen
<RootStack.Screen name="AnimPreview" component={AnimationPreviewScreen} />
```

### 0.3 添加入口（临时，开发完后删除）

在 `SettingsScreen.tsx` 的"关于"section 里加一个入口，方便开发期间进入：

```tsx
// import 里加
import { useNavigation } from '@react-navigation/native';

// 组件里加
const navigation = useNavigation<any>();

// 关于 section 里加一行：
<TouchableOpacity
  style={styles.row}
  onPress={() => navigation.navigate('AnimPreview')}
>
  <Text style={styles.rowText}>动画预览 (开发)</Text>
  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>
```

### 0.4 验证

启动 Expo → Settings → 动画预览 → 应该能看到已有的 `variable-storage` 动画，左右切步骤。

---

## 开发工作流

做完 0.1-0.4 之后，每开发一个新动画的流程：

```
1. 创建 scenarios/{name}.ts     → 写步骤数据
2. 在 animations/index.ts 注册  → 3 行
3. 打开预览页切换到新动画       → 即时看效果
4. 调整步骤、颜色、文案         → 回到第 1 步迭代
5. 满意后在课程节点加一张 card  → animation 类型，animationId 填进去
```

整个过程不需要重启 Metro bundler（fast refresh 自动生效）。

---

## 动画开发模板

创建 `src/data/animations/scenarios/{name}.ts`：

```ts
import type { MemoryBoxScenario } from '../../../types';

export const {name}Scenario: MemoryBoxScenario = {
  id: '{name}',
  title: '{中文标题}',
  cellsPerRow: 8,
  totalRows: 6,
  steps: [
    {
      label: '步骤名称',
      allocations: [
        {
          name: '变量名',    // 显示在格子里的变量名
          type: '类型',      // 显示在格子里的类型
          typeSize: 4,       // 占几格（1 格 = 1 字节）
          value: '值',       // 显示在格子里的值
          color: '#4a9eff',  // 格子填充色
        },
      ],
      showAddresses: false,  // true = 显示地址列
      annotation: '底部注释文字',
    },
    // ... 更多 step
  ],
};
```

注册（`src/data/animations/index.ts`，+3 行）：

```ts
import { {name}Scenario } from './scenarios/{name}';

// 在 animationRegistry 里加：
'{name}': {
  scenario: {name}Scenario,
  Component: null,
  loadComponent() {
    if (!this.Component) {
      this.Component = require('../../components/animations/MemoryBox').default;
    }
  },
},
```

### 颜色参考

| 颜色 | hex | 用途 |
|------|-----|------|
| 蓝 | `#4a9eff` | int 变量 |
| 绿 | `#2ed573` | 第二个变量 |
| 橙 | `#ff9f43` | char |
| 紫 | `#a55eea` | double |
| 红 | `#ff4757` | 错误/警告 |
| 灰 | `#666666` | 已释放/空 |
| 黄 | `#ffa502` | 指针 |
| 青 | `#1e90ff` | 地址值 |

---

## 动画清单

### 动画 1：变量作用域生命周期

| 字段 | 值 |
|------|-----|
| 文件 | `scenarios/scopeLifecycle.ts` |
| ID | `scope-lifecycle` |
| 标题 | 变量作用域 |
| cellsPerRow | 8 |
| totalRows | 4 |
| 绑定 | Module 1.6 作用域 |

**Step 设计**：

```
Step 0: 空网格
        annotation: "程序开始执行，内存为空"

Step 1: int a = 10
        绿色格子 (#2ed573)，4 字节，value=10
        showAddresses: true
        annotation: "进入 main() 的 {}，a 被创建。绿色=活着，可以访问"

Step 2: int b = 20（内层块）
        蓝色格子 (#4a9eff) 出现在 a 旁边，4 字节，value=20
        a 绿色 + b 蓝色共存
        annotation: "进入内层 {}，b 被创建。两个都活着——内层能看到外层！cout << a << b; // 都 OK"

Step 3: 离开内层 {}
        a 保持绿色，b 变灰 (#666666)，type/value 改为 "—"
        b 不消失但标记为"已销毁"
        annotation: "离开内层 {}，b 被销毁（灰色）。只有 a 可以访问。cout << b; // 编译错误！b 已死"

Step 4: 离开外层 {}
        a 也变灰 (#666666)，全部标记为 "—"
        两个格子都灰了
        annotation: "main() 结束。所有变量离开作用域，全部销毁"
```

> 关键设计：离开作用域的变量**不消失**，而是变灰标记"已销毁"。这样绿色=可访问、灰色=已死的对比一目了然，比直接消失更能体现"访问权限"的概念。

---

### 动画 2：动态内存分配

| 字段 | 值 |
|------|-----|
| 文件 | `scenarios/dynamicMemory.ts` |
| ID | `dynamic-memory` |
| 标题 | 动态内存分配 |
| cellsPerRow | 8 |
| totalRows | 8 |
| 绑定 | Module 2-1 |

**Step 设计**：

```
Step 1: 栈上变量 — int a = 10 (上半区，4 字节，蓝色)
         annotation: "栈上的变量：编译时确定大小，自动管理"

Step 2: new 单个对象 — int* p = new int(99)
         栈区：p 占 8 字节（64位指针），存堆地址
         堆区（下半区）：99 占 4 字节，红色
         annotation: "new 在堆上分配内存，返回地址存到指针"

Step 3: new 数组 — int* arr = new int[4]
         堆区新增 4 个连续格子 {1, 2, 3, 4}
         annotation: "new[] 在堆上分配连续空间，arr 指向首元素"

Step 4: delete p — 堆上 99 的格子消失（变灰/空）
         p 还在但指向已释放的内存（悬空指针）
         annotation: "delete 释放单个对象，但 p 变成了悬空指针"

Step 5: 泄漏 — arr 指向别的地址，原来的数组没被释放
         原来的 4 个格子标记红色警告
         annotation: "如果没有 delete[]，堆内存泄漏——程序运行越久，可用内存越少"

Step 6: 正确释放 — delete[] arr
         数组格子消失，堆区清空
         annotation: "new[] 必须配套 delete[]，否则行为未定义"
```

---

### 动画 3：指针与地址

| 字段 | 值 |
|------|-----|
| 文件 | `scenarios/pointerAddress.ts` |
| ID | `pointer-address` |
| 标题 | 指针与地址 |
| cellsPerRow | 4 |
| totalRows | 5 |
| 绑定 | Module 1-8 |

**Step 设计**：

```
Step 1: int x = 42
        一个蓝色格子，显示 x / int / 42
        地址 0x1000（showAddresses: true）
        annotation: "变量 x 在内存中有一个地址 &x = 0x1000"

Step 2: int* p = &x
        新增橙色格子：p / int* / 0x1000
        地址 0x1008
        annotation: "指针 p 本身也是一个变量，它的值是 x 的地址 0x1000"

Step 3: 用颜色高亮 p 和 x 的关系
        p 的格子和 x 的格子用同一高亮边框
        annotation: "p 存的是 x 的地址 → 'p 指向 x'"

Step 4: *p = 99
        x 的值从 42 变为 99
        annotation: "*p 是解引用：通过地址间接访问 x，相当于 x = 99"

Step 5: int& r = x
        r 和 x 共用同一个格子，颜色相同
        annotation: "引用 r 是 x 的别名，不占独立内存，r 就是 x"

Step 6: 对比总结
        指针格 + 引用格并排
        annotation: "指针是存地址的变量（占 8 字节），引用是别名（不占内存）"
```

---

### 动画 4：数组内存布局

| 字段 | 值 |
|------|-----|
| 文件 | `scenarios/arrayLayout.ts` |
| ID | `array-layout` |
| 标题 | 数组内存布局 |
| cellsPerRow | 5 |
| totalRows | 6 |
| 绑定 | Module 1-7 |

**Step 设计**：

```
Step 1: int arr[5]（5 个连续 int 格子排列在同一行）
        值分别为 {3, 7, 2, 9, 5}
        显示每个格子的下标 [0]~[4]
        showAddresses: true
        annotation: "数组 5 个元素连续存放。地址：0x1000, 0x1004, 0x1008, 0x100C, 0x1010"

Step 2: 访问 arr[2]
        高亮第 3 个格子
        地址 = 0x1000 + 2 × sizeof(int) = 0x1008
        annotation: "arr[2] = 基址 + 2×4 = 0x1008，值是 2"

Step 3: 越界 arr[5]
        高亮数组后面的第 6 个格子位置（红色，写着 ?）
        annotation: "arr[5] 访问 0x1014——这不是数组的内存！C++ 不检查越界 ← 这是 bug 的来源"

Step 4: sizeof(arr)
        5 个格子一起高亮
        annotation: "sizeof(arr) = 5 × 4 = 20 字节 = 整个数组的大小"
```

---

### 动画 5：拷贝 vs 移动

| 字段 | 值 |
|------|-----|
| 文件 | `scenarios/copyVsMove.ts` |
| ID | `copy-vs-move` |
| 标题 | 拷贝 vs 移动 |
| cellsPerRow | 8 |
| totalRows | 8 |
| 绑定 | Module 6-1 |

**Step 设计**：

```
Step 1: 初始状态 — vector<int> v1 = {10, 20, 30}
        上半区：v1 的栈对象（小格子，存指针/大小/容量）
        下半区：v1 的堆数据 [10, 20, 30]（3 个蓝色格子）
        annotation: "std::vector 的数据在堆上。v1 内部有一个指针指向堆上的数组"

---- 拷贝路径 ----

Step 2: vector<int> v2 = v1（拷贝构造）
        新增 v2 的栈对象（另一个小格子）
        堆上出现第二份 [10, 20, 30]（3 个绿色格子）
        annotation: "拷贝：在堆上复制一份完整数据。2 份数据 = 2 倍内存 + O(n) 时间"

Step 3: 修改 v2[0] = 99
        v2 的第一个格子变成 99（绿色）
        v1 的第一个格子还是 10（蓝色）
        annotation: "修改 v2 不影响 v1——拷贝后两者完全独立"

---- 移动路径（重置后） ----

Step 4: 重置到初始状态
        同 Step 1
        annotation: "重置。现在看移动语义"

Step 5: vector<int> v3 = std::move(v1)（移动构造）
        v1 的堆指针直接转移给 v3
        v1 变灰/空壳（内部指针为空）
        堆数据 [10, 20, 30] 没有复制，只是换了所有者
        annotation: "移动：只转移了内部指针。数据没有复制，原对象变空。O(1) 时间"

Step 6: 对比
        上半区标注"拷贝：2 份数据，O(n)"
        下半区标注"移动：数据不复制，原对象清空，O(1)"
        annotation: "std::move 不做任何移动——它只是把 v1 转成右值，触发移动构造。真正转移所有权的是移动构造函数"
```

---

### 动画 6：智能指针引用计数

| 字段 | 值 |
|------|-----|
| 文件 | `scenarios/sharedPtr.ts` |
| ID | `shared-ptr` |
| 标题 | shared_ptr 引用计数 |
| cellsPerRow | 6 |
| totalRows | 5 |
| 绑定 | Module 4-5 |

**Step 设计**：

```
Step 1: auto sp1 = make_shared<int>(42)
        栈区：sp1 的格子
        堆区：控制块 [refCount=1] + 数据 [42]
        annotation: "shared_ptr 在堆上有两块：控制块（含引用计数）和数据对象"

Step 2: auto sp2 = sp1（拷贝 shared_ptr）
        sp2 新格子出现
        控制块 refCount 变为 2
        annotation: "每次拷贝 shared_ptr，引用计数 +1。两个指针共享同一个控制块和数据"

Step 3: auto sp3 = sp1
        sp3 出现，refCount = 3
        annotation: "3 个 shared_ptr 指向同一对象，refCount = 3"

Step 4: sp2 离开作用域
        sp2 变灰，refCount = 2
        annotation: "shared_ptr 离开作用域 → 计数 -1。数据还在，因为还有其他指针引用它"

Step 5: sp3 = nullptr（手动释放）
        sp3 变灰，refCount = 1
        annotation: "也可以手动置空来放弃引用"

Step 6: sp1 离开作用域
        refCount = 0
        控制块 + 数据一起消失
        annotation: "最后一个 shared_ptr 离开时 refCount = 0 → 自动释放内存。不会泄漏，也不会重复释放"
```

---

## 工作量

| # | 动画 | 预计 |
|---|------|------|
| 1 | 变量作用域 | 1h |
| 2 | 动态内存分配 | 3h |
| 3 | 指针与地址 | 3h |
| 4 | 数组内存布局 | 2h |
| 5 | 拷贝 vs 移动 | 4h |
| 6 | 智能指针 | 3h |
| **合计** | | **16h** |

---

## 开发顺序建议

1. **先做变量作用域**（最简单，1h 出效果，5 步 2 个变量。做完 1.6 立即可用）
2. 数组内存布局（2h，4 步 5 个元素，建立数组直觉）
3. 动态内存分配（3h，栈/堆对比，较复杂）
4. 智能指针（3h）
5. 指针与地址（3h，可能需要解决颜色编码/高亮的表达问题）
6. 拷贝 vs 移动（最复杂，step 最多）
