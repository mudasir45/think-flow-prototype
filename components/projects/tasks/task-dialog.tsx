'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/lib/types/tasks';
import { addTask, updateTask } from '@/lib/services/tasks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Wand2 } from 'lucide-react';
import { Editor } from '@/components/editor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  task?: Task;
  defaultStatus?: TaskStatus;
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  projectId,
  task,
  defaultStatus = 'todo',
  onTaskCreated,
  onTaskUpdated,
}: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [assignees, setAssignees] = useState<string[]>(task?.assignees || []);
  const [labels, setLabels] = useState<string[]>(task?.labels || []);
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours?.toString() || '');
  const [error, setError] = useState('');

  const handleAIAssist = () => {
    // In a real app, this would call an AI service
    const suggestions = {
      title: "Implement User Authentication Flow",
      description: "Create a secure authentication system with the following features:\n\n- Email and password sign-up\n- Login functionality\n- Password reset flow\n- Email verification\n- Session management\n- OAuth integration (Google, GitHub)\n\nTechnical Requirements:\n- Use JWT for token management\n- Implement proper password hashing\n- Add rate limiting for security\n- Set up proper error handling\n- Create unit tests for auth flows",
      estimatedHours: "16",
      labels: ["authentication", "security", "backend"]
    };

    setTitle(suggestions.title);
    setDescription(suggestions.description);
    setEstimatedHours(suggestions.estimatedHours);
    setLabels(suggestions.labels);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }

    const taskData: Partial<Task> = {
      id: task?.id,
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate?.toISOString(),
      assignees,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      labels,
      attachments: task?.attachments || [],
      subtasks: task?.subtasks || [],
      comments: task?.comments || [],
      dependencies: task?.dependencies || [],
      createdBy: 'user123', // In real app, this would come from auth
    };

    try {
      if (task) {
        const updatedTask = {
          ...task,
          ...taskData,
          updatedAt: new Date().toISOString(),
        } as Task;
        updateTask(updatedTask);
        onTaskUpdated?.(updatedTask);
      } else {
        const newTask = addTask(taskData);
        onTaskCreated?.(newTask);
      }
      onOpenChange(false);
      setError('');
    } catch (err) {
      setError('Failed to save task. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="assignees">Assignees</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title">Task Title *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAIAssist}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      AI Assist
                    </Button>
                  </div>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                      placeholder="Enter estimated hours"
                      step="0.5"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description">
              <div className="space-y-4">
                <Label>Description</Label>
                <Editor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe the task in detail..."
                />
              </div>
            </TabsContent>

            <TabsContent value="assignees">
              <div className="space-y-4">
                <div>
                  <Label>Assignees</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {/* In a real app, this would be populated from project team members */}
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "justify-start",
                        assignees.includes("user1") && "border-primary"
                      )}
                      onClick={() => {
                        const newAssignees = assignees.includes("user1")
                          ? assignees.filter(a => a !== "user1")
                          : [...assignees, "user1"];
                        setAssignees(newAssignees);
                      }}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      John Doe
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "justify-start",
                        assignees.includes("user2") && "border-primary"
                      )}
                      onClick={() => {
                        const newAssignees = assignees.includes("user2")
                          ? assignees.filter(a => a !== "user2")
                          : [...assignees, "user2"];
                        setAssignees(newAssignees);
                      }}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="/avatars/02.png" />
                        <AvatarFallback>SS</AvatarFallback>
                      </Avatar>
                      Sarah Smith
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Labels</Label>
                  <div className="flex flex-wrap gap-2">
                    {/* In a real app, these would be configurable */}
                    {['frontend', 'backend', 'bug', 'feature', 'documentation'].map(label => (
                      <Badge
                        key={label}
                        variant={labels.includes(label) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const newLabels = labels.includes(label)
                            ? labels.filter(l => l !== label)
                            : [...labels, label];
                          setLabels(newLabels);
                        }}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="submit">{task ? 'Update Task' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}