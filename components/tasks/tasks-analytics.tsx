'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks } from '@/lib/services/personal-tasks';
import { Task } from '@/lib/types/personal-tasks';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

export function TasksAnalytics() {
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [priorityData, setPriorityData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const tasks = getTasks();
    
    // Calculate category distribution
    const categories = tasks.reduce((acc, task) => {
      const category = task.category.charAt(0).toUpperCase() + task.category.slice(1);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategoryData(
      Object.entries(categories).map(([name, value]) => ({
        name,
        value,
      }))
    );

    // Calculate priority distribution
    const priorities = tasks.reduce((acc, task) => {
      const priority = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setPriorityData(
      Object.entries(priorities).map(([name, value]) => ({
        name,
        value,
      }))
    );
  }, []);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-muted-foreground">
            Tasks: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Task Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Categories</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
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
            <div className="grid grid-cols-2 gap-2">
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
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Priorities</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {priorityData.map((priority, index) => (
                <div key={priority.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{priority.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}