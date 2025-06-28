'use client';

import { Button } from '@/components/ui/button';
import { Project } from '@/lib/types/projects';
import { Plus } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
  onNewTask: () => void;
}

export function ProjectHeader({ project, onNewTask }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
        <p className="text-muted-foreground">
          {project.description}
        </p>
      </div>
      <Button onClick={onNewTask}>
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </Button>
    </div>
  );
}