import { Sprint } from '../types/sprints';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEY = 'sprints';

export const getSprints = (projectId: string): Sprint[] => {
  const sprints = getFromStorage<Sprint[]>(STORAGE_KEY, []);
  return sprints.filter(sprint => sprint.projectId === projectId);
};

export const addSprint = (sprint: Partial<Sprint>): Sprint => {
  const sprints = getFromStorage<Sprint[]>(STORAGE_KEY, []);
  
  const newSprint: Sprint = {
    id: crypto.randomUUID(),
    projectId: sprint.projectId || '',
    name: sprint.name || '',
    goal: sprint.goal || '',
    startDate: sprint.startDate || '',
    endDate: sprint.endDate || '',
    status: 'planning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  setToStorage(STORAGE_KEY, [...sprints, newSprint]);
  return newSprint;
};

export const updateSprint = (updatedSprint: Sprint): void => {
  const sprints = getFromStorage<Sprint[]>(STORAGE_KEY, []);
  const updatedSprints = sprints.map(sprint =>
    sprint.id === updatedSprint.id
      ? { ...updatedSprint, updatedAt: new Date().toISOString() }
      : sprint
  );
  setToStorage(STORAGE_KEY, updatedSprints);
};

export const deleteSprint = (sprintId: string): void => {
  const sprints = getFromStorage<Sprint[]>(STORAGE_KEY, []);
  const filteredSprints = sprints.filter(sprint => sprint.id !== sprintId);
  setToStorage(STORAGE_KEY, filteredSprints);
};