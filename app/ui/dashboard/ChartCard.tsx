'use client';
import React from 'react';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { LinePath } from '@visx/shape';

interface DataPoint {
  month: string;
  value: number;
}

export function ChartCard({ data }: { data: DataPoint[] }) {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ParentSize>
        {({ width, height }) => {
          const xScale = scaleBand<string>({
            domain: data.map((d) => d.month),
            range: [0, width],
            padding: 0.4,
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
              <LinePath<DataPoint>
                data={data}
                x={(d) => (xScale(d.month)! + xScale.bandwidth() / 2)}
                y={(d) => yScale(d.value)}
                strokeWidth={2}
                stroke="currentColor"
              />
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
}
