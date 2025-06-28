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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Sprint } from '@/lib/types/sprints';
import { addSprint, updateSprint } from '@/lib/services/sprints';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface SprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  sprint?: Sprint;
  onSprintCreated?: (sprint: Sprint) => void;
  onSprintUpdated?: (sprint: Sprint) => void;
}

export function SprintDialog({
  open,
  onOpenChange,
  projectId,
  sprint,
  onSprintCreated,
  onSprintUpdated,
}: SprintDialogProps) {
  const [name, setName] = useState(sprint?.name || '');
  const [goal, setGoal] = useState(sprint?.goal || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    sprint?.startDate ? new Date(sprint.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    sprint?.endDate ? new Date(sprint.endDate) : undefined
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return;
    }

    const sprintData: Partial<Sprint> = {
      id: sprint?.id,
      projectId,
      name: name.trim(),
      goal: goal.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: sprint?.status || 'planning',
    };

    try {
      if (sprint) {
        const updatedSprint = {
          ...sprint,
          ...sprintData,
          updatedAt: new Date().toISOString(),
        } as Sprint;
        updateSprint(updatedSprint);
        onSprintUpdated?.(updatedSprint);
      } else {
        const newSprint = addSprint(sprintData);
        onSprintCreated?.(newSprint);
      }
      onOpenChange(false);
      setError('');
    } catch (err) {
      setError('Failed to save sprint. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{sprint ? 'Edit Sprint' : 'Create New Sprint'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sprint 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Sprint Goal</Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What do you want to achieve in this sprint?"
              />
            </div>

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
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">{sprint ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}