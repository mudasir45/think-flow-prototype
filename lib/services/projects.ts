import { Project } from '../types/projects';
import { getFromStorage, setToStorage } from '../utils/storage';
import projectsData from '@/data/projects.json';

const STORAGE_KEY = 'projects';

// Initialize projects in localStorage if they don't exist
const initializeProjects = () => {
  if (typeof window !== 'undefined') {
    const existingProjects = localStorage.getItem(STORAGE_KEY);
    if (!existingProjects) {
      setToStorage(STORAGE_KEY, projectsData.projects);
    }
  }
};

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') {
    return projectsData.projects;
  }
  
  initializeProjects();
  return getFromStorage<Project[]>(STORAGE_KEY, projectsData.projects);
};

export const getProject = (id: string): Project | null => {
  const projects = getProjects();
  return projects.find(p => p.id === id) || null;
};

export const addProject = (project: Partial<Project>): Project => {
  try {
    const projects = getProjects();
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      startDate: project.startDate || new Date().toISOString(),
      endDate: project.endDate || '',
      progress: project.progress || 0,
      budget: project.budget,
      team: project.team || [],
      tasks: project.tasks || [],
      tags: project.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setToStorage(STORAGE_KEY, updatedProjects);
    return newProject;
  } catch (error) {
    console.error('Failed to add project:', error);
    throw new Error('Failed to add project. Please try again.');
  }
};

export const updateProject = (updatedProject: Project): void => {
  try {
    const projects = getProjects();
    const projectExists = projects.some(p => p.id === updatedProject.id);
    
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const updatedProjects = projects.map(project =>
      project.id === updatedProject.id
        ? { ...updatedProject, updatedAt: new Date().toISOString() }
        : project
    );
    
    setToStorage(STORAGE_KEY, updatedProjects);
  } catch (error) {
    console.error('Failed to update project:', error);
    throw new Error('Failed to update project. Please try again.');
  }
};

export const deleteProject = (id: string): void => {
  try {
    const projects = getProjects();
    const projectExists = projects.some(p => p.id === id);
    
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const filteredProjects = projects.filter(project => project.id !== id);
    setToStorage(STORAGE_KEY, filteredProjects);
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw new Error('Failed to delete project. Please try again.');
  }
};