'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTasks } from '@/lib/services/personal-tasks';
import { Task } from '@/lib/types/personal-tasks';

export function TasksProgress() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    overdue: 0
  });

  useEffect(() => {
    const tasks = getTasks();
    const now = new Date();
    
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const upcoming = tasks.filter(t => 
      t.status === 'todo' && 
      (!t.dueDate || new Date(t.dueDate) > now)
    ).length;
    const overdue = tasks.filter(t =>
      t.status !== 'completed' &&
      t.dueDate &&
      new Date(t.dueDate) < now
    ).length;

    setStats({
      total: tasks.length,
      completed,
      inProgress,
      upcoming,
      overdue
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
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
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcoming}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
        </CardContent>
      </Card>
    </div>
  );
}