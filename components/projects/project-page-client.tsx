'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/types/projects';
import { Task } from '@/lib/types/tasks';
import { getTasks } from '@/lib/services/tasks';
import { KanbanBoard } from '@/components/projects/kanban/kanban-board';
import { ProjectHeader } from '@/components/projects/project-header';
import { ProjectStats } from '@/components/projects/project-stats';
import { TaskDialog } from '@/components/projects/tasks/task-dialog';
import { SprintList } from '@/components/projects/sprints/sprint-list';
import { TeamList } from '@/components/projects/team/team-list';
import { updateProject } from '@/lib/services/projects';

interface ProjectPageClientProps {
  project: Project;
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);

  useEffect(() => {
    setTasks(getTasks(project.id));
  }, [project.id]);

  const handleTeamUpdate = (newTeam: Project['team']) => {
    const updatedProject = { ...currentProject, team: newTeam };
    updateProject(updatedProject);
    setCurrentProject(updatedProject);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProjectHeader project={currentProject} onNewTask={() => setShowNewTask(true)} />
      <ProjectStats project={currentProject} tasks={tasks} />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <KanbanBoard
          project={currentProject}
          tasks={tasks}
          onTasksChange={setTasks}
        />
        <div className="col-span-2 space-y-4">
          <TeamList
            members={currentProject.team}
            onMembersChange={handleTeamUpdate}
          />
          <SprintList projectId={currentProject.id} />
        </div>
      </div>

      <TaskDialog
        open={showNewTask}
        onOpenChange={setShowNewTask}
        projectId={currentProject.id}
        onTaskCreated={(newTask) => setTasks([...tasks, newTask])}
      />
    </div>
  );
}