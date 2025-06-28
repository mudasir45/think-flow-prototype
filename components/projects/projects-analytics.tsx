'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types/projects';
import { getProjects } from '@/lib/services/projects';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface ProjectsAnalyticsProps {
  className?: string;
}

export function ProjectsAnalytics({ className }: ProjectsAnalyticsProps) {
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [priorityData, setPriorityData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const projects = getProjects();
    
    // Calculate status distribution
    const statusCounts = projects.reduce((acc, project) => {
      const status = project.status.charAt(0).toUpperCase() + project.status.slice(1);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStatusData(
      Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }))
    );

    // Calculate priority distribution
    const priorityCounts = projects.reduce((acc, project) => {
      const priority = project.priority.charAt(0).toUpperCase() + project.priority.slice(1);
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setPriorityData(
      Object.entries(priorityCounts).map(([name, value]) => ({
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
            Projects: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Project Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Status Distribution</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {statusData.map((status, index) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{status.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Priority Distribution</h4>
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