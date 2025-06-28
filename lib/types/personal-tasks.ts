export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'errands' | 'other';
export type TaskView = 'list' | 'kanban' | 'calendar';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate?: string;
  reminderDate?: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  subtasks: SubTask[];
  attachments: TaskAttachment[];
  notes: TaskNote[];
  progress: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  sharedWith: string[];
}