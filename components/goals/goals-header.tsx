'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { GoalDialog } from './goal-dialog';

export function GoalsHeader() {
  const [showNewGoal, setShowNewGoal] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
        <p className="text-muted-foreground">
          Track and manage your objectives
        </p>
      </div>
      <Button onClick={() => setShowNewGoal(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Goal
      </Button>
      <GoalDialog open={showNewGoal} onOpenChange={setShowNewGoal} />
    </div>
  );
}