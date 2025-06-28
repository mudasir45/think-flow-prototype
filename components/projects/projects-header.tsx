'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ProjectDialog } from './project-dialog';

export function ProjectsHeader() {
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">
          Manage and track your team projects
        </p>
      </div>
      <Button onClick={() => setShowNewProject(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
      <ProjectDialog open={showNewProject} onOpenChange={setShowNewProject} />
    </div>
  );
}