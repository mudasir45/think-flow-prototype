'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getGoals } from '@/lib/services/goals';
import { Goal } from '@/lib/types/goals';

export function GoalsProgress() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const goals = getGoals();
    const completed = goals.filter((g) => g.progress === 100).length;
    const inProgress = goals.filter((g) => g.progress > 0 && g.progress < 100).length;
    const upcoming = goals.filter((g) => g.progress === 0).length;

    setStats({
      total: goals.length,
      completed,
      inProgress,
      upcoming,
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
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
    </div>
  );
}