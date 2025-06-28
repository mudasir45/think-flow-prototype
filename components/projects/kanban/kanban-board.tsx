'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/lib/types/projects';
import { Task } from '@/lib/types/tasks';
import { KanbanColumn } from './kanban-column';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  className?: string;
  project: Project;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
] as const;

export function KanbanBoard({ className, project, tasks, onTasksChange }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState(COLUMNS);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      );
      onTasksChange(updatedTasks);
      setDraggedTask(null);
    }
  };

  return (
    <Card className={cn("col-span-7", className)}>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              tasks={tasks.filter(task => task.status === column.id)}
              status={column.id as Task['status']}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              projectId={project.id}
              onTasksChange={onTasksChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}