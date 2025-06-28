'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal } from '@/lib/types/goals';
import { getGoals } from '@/lib/services/goals';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface GoalsAnalyticsProps {
  className?: string;
}

export function GoalsAnalytics({ className }: GoalsAnalyticsProps) {
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const goals = getGoals();
    const categories = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategoryData(
      Object.entries(categories).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    );
  }, []);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">
            Goals: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Goals by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {categoryData.map((category, index) => (
            <div key={category.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}