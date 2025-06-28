import { Task, TaskPriority, TaskStatus, TaskCategory } from '../types/personal-tasks';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEY = 'personal_tasks';

// Sample tasks for initial state
const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Project Proposal',
    description: 'Write and submit the Q2 project proposal',
    priority: 'high',
    status: 'todo',
    category: 'work',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
    subtasks: [
      {
        id: 'subtask-1',
        title: 'Research market trends',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'subtask-2',
        title: 'Create budget estimates',
        completed: false,
        createdAt: new Date().toISOString(),
      }
    ],
    attachments: [],
    notes: [],
    progress: 0,
    tags: ['project', 'planning'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sharedWith: []
  },
  {
    id: 'task-2',
    title: 'Daily Exercise Routine',
    description: '30 minutes of cardio and strength training',
    priority: 'medium',
    status: 'todo',
    category: 'health',
    isRecurring: true,
    recurringPattern: {
      frequency: 'daily',
      interval: 1
    },
    subtasks: [],
    attachments: [],
    notes: [],
    progress: 0,
    tags: ['health', 'routine'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sharedWith: []
  }
];

// Initialize tasks if they don't exist
const initializeTasks = () => {
  if (typeof window !== 'undefined') {
    const existingTasks = localStorage.getItem(STORAGE_KEY);
    if (!existingTasks) {
      setToStorage(STORAGE_KEY, sampleTasks);
    }
  }
};

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') {
    return sampleTasks;
  }
  
  initializeTasks();
  return getFromStorage<Task[]>(STORAGE_KEY, []);
};

export const addTask = (task: Partial<Task>): Task => {
  const tasks = getTasks();
  
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    category: task.category || 'other',
    dueDate: task.dueDate,
    reminderDate: task.reminderDate,
    isRecurring: task.isRecurring || false,
    recurringPattern: task.recurringPattern,
    subtasks: task.subtasks || [],
    attachments: task.attachments || [],
    notes: task.notes || [],
    progress: task.progress || 0,
    tags: task.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sharedWith: task.sharedWith || []
  };

  setToStorage(STORAGE_KEY, [...tasks, newTask]);
  return newTask;
};

export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task =>
    task.id === updatedTask.id
      ? { ...updatedTask, updatedAt: new Date().toISOString() }
      : task
  );
  setToStorage(STORAGE_KEY, updatedTasks);
};

export const deleteTask = (id: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  setToStorage(STORAGE_KEY, filteredTasks);
};

export const addSubtask = (taskId: string, title: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const subtask = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  const updatedTask = {
    ...task,
    subtasks: [...task.subtasks, subtask],
    updatedAt: new Date().toISOString()
  };

  updateTask(updatedTask);
};

export const toggleSubtask = (taskId: string, subtaskId: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const updatedSubtasks = task.subtasks.map(st =>
    st.id === subtaskId
      ? {
          ...st,
          completed: !st.completed,
          completedAt: !st.completed ? new Date().toISOString() : undefined
        }
      : st
  );

  const progress = Math.round(
    (updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100
  );

  const updatedTask = {
    ...task,
    subtasks: updatedSubtasks,
    progress,
    updatedAt: new Date().toISOString()
  };

  updateTask(updatedTask);
};

export const addNote = (taskId: string, content: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const note = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updatedTask = {
    ...task,
    notes: [...task.notes, note],
    updatedAt: new Date().toISOString()
  };

  updateTask(updatedTask);
};

export const completeTask = (taskId: string): void => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const updatedTask = {
    ...task,
    status: 'completed' as TaskStatus,
    completedAt: new Date().toISOString(),
    progress: 100,
    updatedAt: new Date().toISOString()
  };

  updateTask(updatedTask);
};