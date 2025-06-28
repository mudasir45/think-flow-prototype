'use client';

import { useEffect, useState } from 'react';
import { Task, TaskStatus } from '@/lib/types/personal-tasks';
import { getTasks, updateTask } from '@/lib/services/personal-tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskDialog } from './task-dialog';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'completed', title: 'Completed' }
];

export function TasksKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask) {
      const updatedTask = { ...draggedTask, status };
      updateTask(updatedTask);
      setTasks(getTasks());
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="col-span-7">
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(column => (
          <div
            key={column.id}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{column.title}</h3>
              <Badge variant="secondary">
                {tasks.filter(t => t.status === column.id).length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <Card
                    key={task.id}
                    className="p-4 cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onDragEnd={handleDragEnd}
                  >
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{task.priority}</Badge>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due {format(new Date(task.dueDate), "MMM d")}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              
              {column.id === 'todo' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setShowNewTask(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <TaskDialog
        open={showNewTask}
        onOpenChange={(open) => {
          if (!open) {
            setShowNewTask(false);
            setTasks(getTasks());
          }
        }}
      />
    </div>
  );
}