'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types/projects';
import { Task } from '@/lib/types/tasks';
import { format } from 'date-fns';

interface ProjectStatsProps {
  project: Project;
  tasks: Task[];
}

export function ProjectStats({ project, tasks }: ProjectStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const daysLeft = Math.ceil(
    (new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            {completedTasks} completed
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTasks}</div>
          <p className="text-xs text-muted-foreground">
            {((inProgressTasks / totalTasks) * 100).toFixed(0)}% of total tasks
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Left</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysLeft}</div>
          <p className="text-xs text-muted-foreground">
            Due {format(new Date(project.endDate), "MMM d, yyyy")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{project.progress}%</div>
          <p className="text-xs text-muted-foreground">
            Overall completion
          </p>
        </CardContent>
      </Card>
    </div>
  );
}