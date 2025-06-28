'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/types/projects';
import { getProjects, deleteProject } from '@/lib/services/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectDialog } from './project-dialog';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Calendar, Users, CheckSquare, AlertCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ProjectsListProps {
  className?: string;
}

export function ProjectsList({ className }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const router = useRouter();

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  const handleEdit = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent navigation when clicking edit
    setEditingProject(project);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'on-hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEdit(e, project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(e, project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-6">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Timeline</p>
                      <p>{format(new Date(project.startDate), "MMM d")} - {format(new Date(project.endDate), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="text-muted-foreground">Tasks</p>
                      <p>{project.tasks.filter(t => t.status === 'completed').length} of {project.tasks.length} completed</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {project.team.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Team</span>
                    </div>
                    <div className="flex -space-x-2">
                      {project.team.map((member) => (
                        <Avatar key={member.id} className="border-2 border-background">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                )}

                {project.status === 'on-hold' && (
                  <div className="mt-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">This project is currently on hold</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      {editingProject && (
        <ProjectDialog
          open={!!editingProject}
          onOpenChange={(open) => {
            if (!open) {
              setEditingProject(null);
              setProjects(getProjects());
            }
          }}
          project={editingProject}
        />
      )}
    </Card>
  );
}