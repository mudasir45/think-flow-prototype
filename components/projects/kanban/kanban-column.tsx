'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Task } from '@/lib/types/tasks';
import { KanbanTask } from './kanban-task';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '../tasks/task-dialog';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  projectId: string;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDrop: (status: Task['status']) => void;
  onTasksChange: (tasks: Task[]) => void;
}

export function KanbanColumn({
  title,
  tasks,
  status,
  projectId,
  onDragStart,
  onDragEnd,
  onDrop,
  onTasksChange,
}: KanbanColumnProps) {
  const [showNewTask, setShowNewTask] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div
      className="flex flex-col gap-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="text-muted-foreground text-sm">{tasks.length}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNewTask(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <KanbanTask
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onTasksChange={onTasksChange}
          />
        ))}
      </div>

      <TaskDialog
        open={showNewTask}
        onOpenChange={setShowNewTask}
        projectId={projectId}
        defaultStatus={status}
        onTaskCreated={(newTask) => onTasksChange([...tasks, newTask])}
      />
    </div>
  );
}