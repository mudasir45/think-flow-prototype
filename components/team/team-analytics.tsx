'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamMembers } from '@/lib/services/team';
import { TeamMember } from '@/lib/types/team';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface TeamAnalyticsProps {
  className?: string;
}

export function TeamAnalytics({ className }: TeamAnalyticsProps) {
  const [departmentData, setDepartmentData] = useState<{ name: string; value: number }[]>([]);
  const [roleData, setRoleData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const members = getTeamMembers();
    
    // Calculate department distribution
    const departments = members.reduce((acc, member) => {
      const department = member.department.charAt(0).toUpperCase() + member.department.slice(1);
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setDepartmentData(
      Object.entries(departments).map(([name, value]) => ({
        name,
        value,
      }))
    );

    // Calculate role distribution
    const roles = members.reduce((acc, member) => {
      const role = member.role.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setRoleData(
      Object.entries(roles).map(([name, value]) => ({
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
            Members: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Team Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Department Distribution</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {departmentData.map((department, index) => (
                <div key={department.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{department.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Role Distribution</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roleData.map((role, index) => (
                <div key={role.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{role.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}