import React, { useMemo } from 'react';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import type { VarAlloc } from '@/types';

interface GridRendererProps {
  rows: number;
  cols: number;
  cellSize: number;
  gap: number;
  allocations: VarAlloc[];
}

type CellInfo = { x: number; y: number; fill: string; label: string | null };

export default function GridRenderer({
  rows,
  cols,
  cellSize,
  gap,
  allocations,
}: GridRendererProps) {
  const totalCells = rows * cols;
  const svgWidth = cols * (cellSize + gap) - gap;
  const svgHeight = rows * (cellSize + gap) - gap;

  const cells = useMemo<CellInfo[]>(() => {
    // 预计算每个分配的首字节位置 → 值标签
    const labelMap: Record<number, string> = {};
    const colorMap: Record<number, string> = {};
    let offset = 0;
    for (const alloc of allocations) {
      labelMap[offset] = alloc.value;
      for (let j = 0; j < alloc.typeSize; j++) {
        colorMap[offset + j] = alloc.color;
      }
      offset += alloc.typeSize;
    }

    const result: CellInfo[] = [];
    const emptyColor = '#2a2a3e';

    for (let i = 0; i < totalCells; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = col * (cellSize + gap);
      const y = row * (cellSize + gap);
      const fill = colorMap[i] ?? emptyColor;

      result.push({ x, y, fill, label: labelMap[i] ?? null });
    }
    return result;
  }, [rows, cols, cellSize, gap, allocations]);

  return (
    <Svg width={svgWidth} height={svgHeight}>
      {cells.map((cell, i) => {
        const isActive = cell.fill !== '#2a2a3e';
        return (
          <React.Fragment key={i}>
            <Rect
              x={cell.x}
              y={cell.y}
              width={cellSize}
              height={cellSize}
              rx={4}
              fill={cell.fill}
              stroke={isActive ? cell.fill : '#3a3a4e'}
              strokeWidth={1}
            />
            {cell.label && (
              <SvgText
                x={cell.x + cellSize / 2}
                y={cell.y + cellSize / 2 + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
                fontWeight="bold"
              >
                {cell.label}
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
