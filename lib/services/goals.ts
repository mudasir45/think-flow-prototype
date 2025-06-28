import { Goal } from '../types/goals';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEY = 'goals';

export const getGoals = (): Goal[] => {
  return getFromStorage<Goal[]>(STORAGE_KEY, []);
};

export const addGoal = (goal: Goal): void => {
  const goals = getGoals();
  
  if (!goal.id) {
    // Creating a new goal
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      reflections: [],
      obstacles: goal.obstacles || [],
      milestones: goal.milestones || []
    };
    setToStorage(STORAGE_KEY, [...goals, newGoal]);
  } else {
    // Updating an existing goal
    const updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
    setToStorage(STORAGE_KEY, updatedGoals);
  }
};

export const updateGoal = (updatedGoal: Goal): void => {
  const goals = getGoals();
  const updatedGoals = goals.map((goal) =>
    goal.id === updatedGoal.id ? updatedGoal : goal
  );
  setToStorage(STORAGE_KEY, updatedGoals);
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals();
  const filteredGoals = goals.filter((goal) => goal.id !== id);
  setToStorage(STORAGE_KEY, filteredGoals);
};

export const updateGoalProgress = (id: string, progress: number): void => {
  const goals = getGoals();
  const updatedGoals = goals.map((goal) =>
    goal.id === id ? { ...goal, progress } : goal
  );
  setToStorage(STORAGE_KEY, updatedGoals);
};