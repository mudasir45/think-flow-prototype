'use client';

import { Button } from '@/components/ui/button';
import { Plus, List, LayoutGrid, Calendar } from 'lucide-react';
import { useState } from 'react';
import { TaskDialog } from './task-dialog';
import { TaskView } from '@/lib/types/personal-tasks';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TasksHeaderProps {
  view: TaskView;
  onViewChange: (view: TaskView) => void;
}

export function TasksHeader({ view, onViewChange }: TasksHeaderProps) {
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground">
          Manage your personal and work tasks
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v as TaskView)}>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="kanban" aria-label="Kanban view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="calendar" aria-label="Calendar view">
            <Calendar className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={() => setShowNewTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
      <TaskDialog open={showNewTask} onOpenChange={setShowNewTask} />
    </div>
  );
}