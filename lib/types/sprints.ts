export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}