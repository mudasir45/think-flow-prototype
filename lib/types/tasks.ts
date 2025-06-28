export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
  dueDate: string;
  estimatedHours?: number;
  loggedHours?: number;
  labels: string[];
  attachments: TaskAttachment[];
  subtasks: SubTask[];
  comments: TaskComment[];
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  sprintId?: string;
}