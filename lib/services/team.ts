import { TeamMember, Department } from '../types/team';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEY = 'team_members';
const DEPARTMENTS_KEY = 'departments';

// Sample team members for initial state
const sampleTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Sarah Johnson',
    role: 'tech_lead',
    department: 'engineering',
    email: 'sarah.johnson@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    status: 'active',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    joinDate: '2022-03-15',
    bio: 'Experienced tech lead with a passion for building scalable systems and mentoring teams.',
    skills: ['React', 'Node.js', 'AWS', 'System Design', 'Team Leadership'],
    projects: ['Project Phoenix', 'Cloud Migration'],
    directReports: ['tm2', 'tm3'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      github: 'https://github.com/sarahj'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      slack: '@sarah'
    },
    performance: {
      rating: 4.8,
      completedProjects: 12,
      ongoingProjects: 2
    }
  },
  {
    id: 'tm2',
    name: 'Michael Chen',
    role: 'developer',
    department: 'engineering',
    email: 'michael.chen@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop',
    status: 'active',
    location: 'New York, NY',
    timezone: 'America/New_York',
    joinDate: '2023-01-10',
    bio: 'Full-stack developer specializing in React and Node.js applications.',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    projects: ['Customer Portal', 'API Modernization'],
    reportsTo: 'tm1',
    directReports: [],
    socialLinks: {
      github: 'https://github.com/michaelc'
    },
    contact: {
      slack: '@michael'
    },
    performance: {
      rating: 4.5,
      completedProjects: 8,
      ongoingProjects: 1
    }
  },
  {
    id: 'tm3',
    name: 'Emily Rodriguez',
    role: 'designer',
    department: 'design',
    email: 'emily.rodriguez@company.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop',
    status: 'active',
    location: 'Miami, FL',
    timezone: 'America/New_York',
    joinDate: '2023-06-20',
    bio: 'UI/UX designer focused on creating beautiful and intuitive user experiences.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe Creative Suite'],
    projects: ['Brand Refresh', 'Mobile App Design'],
    reportsTo: 'tm1',
    directReports: [],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyrodriguez'
    },
    contact: {
      slack: '@emily'
    },
    performance: {
      rating: 4.6,
      completedProjects: 6,
      ongoingProjects: 2
    }
  }
];

// Sample departments
const sampleDepartments: Department[] = [
  {
    id: 'dep1',
    name: 'engineering',
    description: 'Software development and technical operations',
    headCount: 15,
    lead: 'tm1',
    budget: 1500000,
    projects: 8
  },
  {
    id: 'dep2',
    name: 'design',
    description: 'Product design and user experience',
    headCount: 8,
    lead: 'tm3',
    budget: 800000,
    projects: 12
  }
];

// Initialize data if it doesn't exist
const initializeData = () => {
  if (typeof window !== 'undefined') {
    const existingMembers = localStorage.getItem(STORAGE_KEY);
    const existingDepartments = localStorage.getItem(DEPARTMENTS_KEY);
    
    if (!existingMembers) {
      setToStorage(STORAGE_KEY, sampleTeamMembers);
    }
    if (!existingDepartments) {
      setToStorage(DEPARTMENTS_KEY, sampleDepartments);
    }
  }
};

export const getTeamMembers = (): TeamMember[] => {
  if (typeof window === 'undefined') {
    return sampleTeamMembers;
  }
  
  initializeData();
  return getFromStorage<TeamMember[]>(STORAGE_KEY, []);
};

export const getDepartments = (): Department[] => {
  if (typeof window === 'undefined') {
    return sampleDepartments;
  }
  
  initializeData();
  return getFromStorage<Department[]>(DEPARTMENTS_KEY, []);
};

export const addTeamMember = (member: Partial<TeamMember>): TeamMember => {
  const members = getTeamMembers();
  
  const newMember: TeamMember = {
    id: crypto.randomUUID(),
    name: member.name || '',
    role: member.role || 'developer',
    department: member.department || 'engineering',
    email: member.email || '',
    avatar: member.avatar || '',
    status: member.status || 'active',
    location: member.location || '',
    timezone: member.timezone || '',
    joinDate: member.joinDate || new Date().toISOString(),
    bio: member.bio || '',
    skills: member.skills || [],
    projects: member.projects || [],
    directReports: member.directReports || [],
    socialLinks: member.socialLinks || {},
    contact: member.contact || {},
    performance: member.performance || {
      rating: 0,
      completedProjects: 0,
      ongoingProjects: 0
    }
  };

  setToStorage(STORAGE_KEY, [...members, newMember]);
  return newMember;
};

export const updateTeamMember = (updatedMember: TeamMember): void => {
  const members = getTeamMembers();
  const updatedMembers = members.map(member =>
    member.id === updatedMember.id ? updatedMember : member
  );
  setToStorage(STORAGE_KEY, updatedMembers);
};

export const deleteTeamMember = (id: string): void => {
  const members = getTeamMembers();
  const filteredMembers = members.filter(member => member.id !== id);
  setToStorage(STORAGE_KEY, filteredMembers);
};

export const updateDepartment = (updatedDepartment: Department): void => {
  const departments = getDepartments();
  const updatedDepartments = departments.map(department =>
    department.id === updatedDepartment.id ? updatedDepartment : department
  );
  setToStorage(DEPARTMENTS_KEY, updatedDepartments);
};