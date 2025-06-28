'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Calendar } from 'lucide-react';
import { Milestone } from '@/lib/types/goals';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface MilestonesFormProps {
  milestones: Milestone[];
  onChange: (milestones: Milestone[]) => void;
  goalId: string;
}

export function MilestonesForm({ milestones, onChange, goalId }: MilestonesFormProps) {
  const [newMilestone, setNewMilestone] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [error, setError] = useState<string>('');

  const handleAdd = () => {
    if (!newMilestone.trim() || !selectedDate) {
      setError('Please provide both a milestone title and target date');
      return;
    }

    const milestone: Milestone = {
      id: crypto.randomUUID(),
      goalId,
      title: newMilestone,
      targetDate: selectedDate.toISOString(),
      status: 'pending'
    };

    onChange([...milestones, milestone]);
    setNewMilestone('');
    setSelectedDate(undefined);
    setError('');
  };

  const handleRemove = (id: string) => {
    onChange(milestones.filter(m => m.id !== id));
  };

  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="What's your next milestone?"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              className="w-full"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleAdd} size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">Timeline</h4>
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6 pl-8">
            {sortedMilestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="relative flex items-center justify-between group"
              >
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{milestone.title}</span>
                    <Badge variant="outline">
                      {format(new Date(milestone.targetDate), "MMM d, yyyy")}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(milestone.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}