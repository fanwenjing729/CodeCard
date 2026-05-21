import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import GridRenderer from './shared/GridRenderer';
import VarLabel from './shared/VarLabel';
import AddressColumn from './shared/AddressColumn';
import type { MemoryBoxScenario } from '../../types';

// ===== 动画参数 =====
const CELL_SIZE = 36;
const GAP = 2;
const PADDING_TOP = 56;
const ADDRESS_COL_WIDTH = 72;

interface MemoryBoxProps {
  scenario: MemoryBoxScenario;
  step: number;
}

export default function MemoryBox({ scenario, step }: MemoryBoxProps) {
  const currentStep = scenario.steps[step] ?? scenario.steps[0];

  // 每个 allocation 的起始字节位置
  const allocStartBytes = useMemo(() => {
    let offset = 0;
    return currentStep.allocations.map((alloc) => {
      const start = offset;
      offset += alloc.typeSize;
      return start;
    });
  }, [currentStep.allocations]);

  // step 切换时淡入
  const animOpacity = useSharedValue(0);

  useEffect(() => {
    animOpacity.value = 0;
    animOpacity.value = withTiming(1, {
      duration: 350,
      easing: Easing.inOut(Easing.quad),
    });
  }, [step]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: animOpacity.value,
  }));

  // 地址列动画：grid marginLeft 与 AddressColumn 滑入同步
  const gridMargin = useSharedValue(0);

  useEffect(() => {
    const target = currentStep.showAddresses ? ADDRESS_COL_WIDTH : 0;
    const duration = currentStep.showAddresses ? 400 : 300;
    gridMargin.value = withTiming(target, {
      duration,
      easing: Easing.inOut(Easing.quad),
    });
  }, [currentStep.showAddresses]);

  const gridAnimStyle = useAnimatedStyle(() => ({
    marginLeft: gridMargin.value,
  }));

  const hasAllocations = currentStep.allocations.length > 0;

  return (
    <View style={styles.container}>
      {/* 地址列：始终挂载，用 visible 驱动进出动画；顶部偏移与网格对齐 */}
      <View
        style={{
          paddingTop: hasAllocations ? PADDING_TOP : 0,
          width: currentStep.showAddresses ? ADDRESS_COL_WIDTH : 0,
          overflow: 'hidden',
        }}
      >
        <AddressColumn
          visible={currentStep.showAddresses}
          rows={scenario.totalRows}
          cols={scenario.cellsPerRow}
          cellSize={CELL_SIZE}
          gap={GAP}
        />
      </View>

      {/* 主体区域 */}
      <Animated.View style={[styles.gridArea, gridAnimStyle]}>
        {/* 变量标签 */}
        {currentStep.allocations.map((alloc, i) => (
          <VarLabel
            key={`${step}-${alloc.name}-${i}`}
            alloc={alloc}
            index={i}
            cellSize={CELL_SIZE}
            gap={GAP}
            cols={scenario.cellsPerRow}
            startByte={allocStartBytes[i]}
          />
        ))}

        {/* SVG 格子矩阵 */}
        <View style={{ marginTop: hasAllocations ? PADDING_TOP : 0 }}>
          <Animated.View style={animStyle}>
            <GridRenderer
              rows={scenario.totalRows}
              cols={scenario.cellsPerRow}
              cellSize={CELL_SIZE}
              gap={GAP}
              allocations={currentStep.allocations}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
  },
  gridArea: {
    flex: 1,
    position: 'relative',
  },
});

