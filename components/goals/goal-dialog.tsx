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
import { addGoal } from '@/lib/services/goals';
import { SmartGoalForm } from './smart-goal-form';
import { MilestonesForm } from './milestones-form';
import { Goal, Milestone } from '@/lib/types/goals';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
}

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [category, setCategory] = useState(goal?.category || 'personal');
  const [targetDate, setTargetDate] = useState(goal?.targetDate || '');
  const [smartValues, setSmartValues] = useState({
    specific: goal?.specific || '',
    measurable: goal?.measurable || '',
    achievable: goal?.achievable || '',
    relevant: goal?.relevant || '',
    timebound: goal?.timebound || ''
  });
  const [milestones, setMilestones] = useState<Milestone[]>(goal?.milestones || []);
  const [obstacles, setObstacles] = useState<string[]>(goal?.obstacles || []);
  const [actionPlan, setActionPlan] = useState(goal?.actionPlan || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !targetDate || !category) {
      setError('Please fill in all required fields');
      return;
    }

    const goalData: Partial<Goal> = {
      id: goal?.id, // Will be undefined for new goals
      title: title.trim(),
      description: description.trim(),
      category,
      targetDate,
      status: goal?.status || 'active',
      progress: goal?.progress || 0,
      ...smartValues,
      milestones,
      obstacles,
      actionPlan: actionPlan.trim(),
      reflections: goal?.reflections || []
    };

    try {
      addGoal(goalData as Goal);
      onOpenChange(false);
      setError('');
    } catch (err) {
      setError('Failed to save goal. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="smart">SMART</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Date *</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="smart">
              <SmartGoalForm
                values={smartValues}
                onChange={setSmartValues}
              />
            </TabsContent>

            <TabsContent value="milestones">
              <MilestonesForm
                milestones={milestones}
                onChange={setMilestones}
                goalId={goal?.id || 'new'}
              />
            </TabsContent>

            <TabsContent value="planning" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actionPlan">Action Plan</Label>
                <Textarea
                  id="actionPlan"
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="Detail the steps you'll take to achieve this goal..."
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-4">
            <Button type="submit">{goal ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}