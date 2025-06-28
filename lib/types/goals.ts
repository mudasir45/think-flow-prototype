export type GoalCategory = 'personal' | 'professional' | 'financial' | 'health' | 'education' | 'relationships';
export type GoalStatus = 'active' | 'completed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'completed';

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetDate: string;
  status: MilestoneStatus;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  progress: number;
  createdAt: string;
  status: GoalStatus;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
  milestones: Milestone[];
  obstacles: string[];
  actionPlan: string;
  reflections: string[];
}

export interface Quote {
  text: string;
  author: string;
}