'use client';

import { XAxis, YAxis } from 'recharts';

export function CustomXAxis({ dataKey }: { dataKey: string }) {
  return (
    <XAxis
      dataKey={dataKey}
      stroke="#888888"
      fontSize={12}
      tickLine={false}
      axisLine={false}
    />
  );
}

export function CustomYAxis() {
  return (
    <YAxis
      stroke="#888888"
      fontSize={12}
      tickLine={false}
      axisLine={false}
      tickFormatter={(value: number) => `${value}`}
    />
  );
}