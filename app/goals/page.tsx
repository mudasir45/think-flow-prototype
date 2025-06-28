'use client';

import { GoalsHeader } from '@/components/goals/goals-header';
import { GoalsList } from '@/components/goals/goals-list';
import { GoalsProgress } from '@/components/goals/goals-progress';
import { GoalsAnalytics } from '@/components/goals/goals-analytics';

export default function GoalsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <GoalsHeader />
      <GoalsProgress />
      <div className="grid gap-4 grid-cols-1">
        <GoalsList />
      </div>
    </div>
  );
}