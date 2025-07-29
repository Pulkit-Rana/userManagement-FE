'use client';
import React from 'react';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';

interface BarData {
  category: string;
  value: number;
}

export function BarChartCard({ data }: { data: BarData[] }) {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ParentSize>
        {({ width, height }) => {
          const xScale = scaleBand<string>({
            domain: data.map((d) => d.category),
            range: [0, width],
            padding: 0.3,
          });
          const yMax = Math.max(...data.map((d) => d.value));
          const yScale = scaleLinear<number>({
            domain: [0, yMax],
            range: [height, 0],
          });

          return (
            <svg width={width} height={height}>
              <AxisBottom top={height} scale={xScale} />
              <AxisLeft scale={yScale} />
              <Group>
                {data.map((d) => {
                  const barWidth = xScale.bandwidth();
                  const barHeight = height - (yScale(d.value) ?? 0);
                  const x = xScale(d.category) ?? 0;
                  const y = (yScale(d.value) ?? 0);
                  return (
                    <rect
                      key={d.category}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="currentColor"
                    />
                  );
                })}
              </Group>
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
}