export type ProjectStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: ProjectPriority;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  progress: number;
  budget?: number;
  team: ProjectMember[];
  tasks: ProjectTask[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}