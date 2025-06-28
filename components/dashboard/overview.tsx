'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomXAxis } from '@/components/ui/custom-axis';
import { CustomYAxis } from '@/components/ui/custom-axis';

const data = [
  { name: 'Jan', total: 12 },
  { name: 'Feb', total: 15 },
  { name: 'Mar', total: 18 },
  { name: 'Apr', total: 14 },
  { name: 'May', total: 22 },
  { name: 'Jun', total: 25 },
  { name: 'Jul', total: 28 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CustomXAxis dataKey="name" />
        <CustomYAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}