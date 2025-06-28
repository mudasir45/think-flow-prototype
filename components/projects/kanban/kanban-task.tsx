'use client';

import { useState } from 'react';
import { Task } from '@/lib/types/tasks';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, AlertCircle, MessageSquare, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaskDialog } from '../tasks/task-dialog';

interface KanbanTaskProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onTasksChange: (tasks: Task[]) => void;
}

export function KanbanTask({ task, onDragStart, onDragEnd, onTasksChange }: KanbanTaskProps) {
  const [showEdit, setShowEdit] = useState(false);

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[priority] || colors.medium;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <>
      <Card
        className="p-4 cursor-move hover:shadow-md transition-shadow"
        draggable
        onDragStart={() => onDragStart(task)}
        onDragEnd={onDragEnd}
        onClick={() => setShowEdit(true)}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium leading-none">{task.title}</h4>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.dueDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                  {isOverdue && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </div>

            {task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.map((assignee, index) => (
                  <Avatar key={assignee} className="border-2 border-background h-6 w-6">
                    <AvatarImage src={`/avatars/0${index + 1}.png`} />
                    <AvatarFallback>
                      {assignee.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {task.subtasks.length > 0 && (
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </span>
                </div>
              )}
              {task.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{task.comments.length}</span>
                </div>
              )}
            </div>

            {task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.map(label => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <TaskDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        projectId={task.projectId}
        task={task}
        onTaskUpdated={(updatedTask) => {
          onTasksChange((tasks) =>
            tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
        }}
      />
    </>
  );
}