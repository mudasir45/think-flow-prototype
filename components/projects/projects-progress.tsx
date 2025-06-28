'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjects } from '@/lib/services/projects';
import { Project } from '@/lib/types/projects';

export function ProjectsProgress() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    onHold: 0,
  });

  useEffect(() => {
    const projects = getProjects();
    const completed = projects.filter((p) => p.status === 'completed').length;
    const inProgress = projects.filter((p) => p.status === 'in-progress').length;
    const onHold = projects.filter((p) => p.status === 'on-hold').length;

    setStats({
      total: projects.length,
      completed,
      inProgress,
      onHold,
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">On Hold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.onHold}</div>
        </CardContent>
      </Card>
    </div>
  );
}