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
import { Project, ProjectPriority, ProjectStatus } from '@/lib/types/projects';
import { addProject, updateProject } from '@/lib/services/projects';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Wand2 } from 'lucide-react';
import { Editor } from '@/components/editor';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'planning');
  const [priority, setPriority] = useState<ProjectPriority>(project?.priority || 'medium');
  const [startDate, setStartDate] = useState<Date | undefined>(
    project?.startDate ? new Date(project.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    project?.endDate ? new Date(project.endDate) : undefined
  );
  const [budget, setBudget] = useState(project?.budget?.toString() || '');
  const [error, setError] = useState('');

  const handleAIAssist = () => {
    // In a real app, this would call an AI service
    const suggestions = {
      title: "E-commerce Platform Redesign",
      description: "Complete overhaul of our e-commerce platform to improve user experience, increase conversion rates, and modernize the technology stack. The project includes redesigning the user interface, optimizing the checkout process, implementing new payment methods, and enhancing mobile responsiveness.\n\nKey Objectives:\n- Improve user experience and interface design\n- Optimize checkout flow and reduce cart abandonment\n- Implement modern technology stack\n- Enhance mobile experience\n- Integrate new payment methods\n\nExpected Outcomes:\n- 25% increase in conversion rate\n- 40% reduction in cart abandonment\n- 50% improvement in page load times\n- 30% increase in mobile sales",
    };

    setTitle(suggestions.title);
    setDescription(suggestions.description);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return;
    }

    const projectData: Partial<Project> = {
      id: project?.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      budget: budget ? parseFloat(budget) : undefined,
      team: project?.team || [],
      tasks: project?.tasks || [],
      tags: project?.tags || [],
      progress: project?.progress || 0,
    };

    try {
      if (project) {
        updateProject(projectData as Project);
      } else {
        addProject(projectData);
      }
      onOpenChange(false);
      setError('');
    } catch (err) {
      setError('Failed to save project. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Project Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title">Project Title *</Label>
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
                    placeholder="Enter project title"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Description</Label>
                  <Editor
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe the project objectives, scope, and expected outcomes..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as ProjectPriority)}>
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
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter project budget"
                  className="font-mono"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="submit">{project ? 'Update Project' : 'Create Project'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}