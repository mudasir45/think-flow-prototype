import { Task, TaskStatus } from '../types/tasks';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEY = 'tasks';

export const getTasks = (projectId: string): Task[] => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  return tasks.filter(task => task.projectId === projectId);
};

export const getTask = (taskId: string): Task | null => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  return tasks.find(task => task.id === taskId) || null;
};

export const addTask = (task: Partial<Task>): Task => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  
  const newTask: Task = {
    id: crypto.randomUUID(),
    projectId: task.projectId || '',
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'backlog',
    priority: task.priority || 'medium',
    assignees: task.assignees || [],
    dueDate: task.dueDate || '',
    estimatedHours: task.estimatedHours,
    loggedHours: 0,
    labels: task.labels || [],
    attachments: [],
    subtasks: [],
    comments: [],
    dependencies: task.dependencies || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: task.createdBy || '',
    sprintId: task.sprintId,
  };

  setToStorage(STORAGE_KEY, [...tasks, newTask]);
  return newTask;
};

export const updateTask = (updatedTask: Task): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const updatedTasks = tasks.map(task =>
    task.id === updatedTask.id
      ? { ...updatedTask, updatedAt: new Date().toISOString() }
      : task
  );
  setToStorage(STORAGE_KEY, updatedTasks);
};

export const deleteTask = (taskId: string): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  setToStorage(STORAGE_KEY, filteredTasks);
};

export const updateTaskStatus = (taskId: string, status: TaskStatus): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const updatedTasks = tasks.map(task =>
    task.id === taskId
      ? { ...task, status, updatedAt: new Date().toISOString() }
      : task
  );
  setToStorage(STORAGE_KEY, updatedTasks);
};

export const addComment = (taskId: string, userId: string, content: string): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const comment = {
    id: crypto.randomUUID(),
    taskId,
    userId,
    content,
    createdAt: new Date().toISOString(),
  };

  const updatedTask = {
    ...task,
    comments: [...task.comments, comment],
    updatedAt: new Date().toISOString(),
  };

  updateTask(updatedTask);
};

export const addSubtask = (taskId: string, title: string): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const subtask = {
    id: crypto.randomUUID(),
    taskId,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const updatedTask = {
    ...task,
    subtasks: [...task.subtasks, subtask],
    updatedAt: new Date().toISOString(),
  };

  updateTask(updatedTask);
};

export const toggleSubtask = (taskId: string, subtaskId: string): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const updatedSubtasks = task.subtasks.map(st =>
    st.id === subtaskId
      ? {
          ...st,
          completed: !st.completed,
          completedAt: !st.completed ? new Date().toISOString() : undefined,
        }
      : st
  );

  const updatedTask = {
    ...task,
    subtasks: updatedSubtasks,
    updatedAt: new Date().toISOString(),
  };

  updateTask(updatedTask);
};

export const logTime = (taskId: string, hours: number): void => {
  const tasks = getFromStorage<Task[]>(STORAGE_KEY, []);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) return;

  const updatedTask = {
    ...task,
    loggedHours: (task.loggedHours || 0) + hours,
    updatedAt: new Date().toISOString(),
  };

  updateTask(updatedTask);
};