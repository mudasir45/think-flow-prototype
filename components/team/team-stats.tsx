'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeamMembers, getDepartments } from '@/lib/services/team';
import { TeamMember, Department } from '@/lib/types/team';

export function TeamStats() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembersPercent: 0,
    departmentsCount: 0,
    averageTeamSize: 0,
  });

  useEffect(() => {
    const members = getTeamMembers();
    const departments = getDepartments();
    
    const activeMembers = members.filter(m => m.status === 'active').length;
    
    setStats({
      totalMembers: members.length,
      activeMembersPercent: Math.round((activeMembers / members.length) * 100),
      departmentsCount: departments.length,
      averageTeamSize: Math.round(members.length / departments.length),
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground">
            Across all departments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeMembersPercent}%</div>
          <p className="text-xs text-muted-foreground">
            Of team members are active
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.departmentsCount}</div>
          <p className="text-xs text-muted-foreground">
            Functional departments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageTeamSize}</div>
          <p className="text-xs text-muted-foreground">
            Members per department
          </p>
        </CardContent>
      </Card>
    </div>
  );
}