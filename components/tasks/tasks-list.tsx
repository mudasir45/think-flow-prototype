'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types/personal-tasks';
import { getTasks, completeTask, deleteTask } from '@/lib/services/personal-tasks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { TaskDialog } from './task-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Edit, Trash2, AlertCircle, CheckCircle2, Clock, Tag } from 'lucide-react';

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      setTasks(getTasks());
    }
  };

  const handleComplete = (id: string) => {
    completeTask(id);
    setTasks(getTasks());
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'work': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'personal': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'health': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'learning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'errands': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="col-span-4 space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={task.status === 'completed'}
                  onCheckedChange={() => handleComplete(task.id)}
                />
                <div>
                  <h3 className={cn(
                    "text-lg font-semibold",
                    task.status === 'completed' && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingTask(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge className={getCategoryColor(task.category)}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </Badge>
              {task.isRecurring && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Recurring
                </Badge>
              )}
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Due: {format(new Date(task.dueDate), "PPP")}</span>
                {new Date(task.dueDate) < new Date() && task.status !== 'completed' && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
            )}

            {task.subtasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtasks Progress</span>
                  <span>
                    {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length}
                  </span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            )}

            {task.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {task.status === 'completed' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">
                  Completed {task.completedAt && format(new Date(task.completedAt), "PPP")}
                </span>
              </div>
            )}
          </div>
        </Card>
      ))}

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={(open) => {
            if (!open) {
              setEditingTask(null);
              setTasks(getTasks());
            }
          }}
          task={editingTask}
        />
      )}
    </div>
  );
}