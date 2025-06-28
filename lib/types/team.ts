export type TeamMemberRole = 
  | 'developer' 
  | 'designer' 
  | 'product_manager' 
  | 'qa_engineer' 
  | 'tech_lead' 
  | 'project_manager' 
  | 'marketing' 
  | 'sales' 
  | 'hr' 
  | 'admin';

export type TeamMemberStatus = 'active' | 'on_leave' | 'inactive';
export type TeamView = 'grid' | 'list';
export type DepartmentType = 'engineering' | 'design' | 'product' | 'marketing' | 'sales' | 'hr' | 'operations';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  department: DepartmentType;
  email: string;
  avatar: string;
  status: TeamMemberStatus;
  location: string;
  timezone: string;
  joinDate: string;
  bio: string;
  skills: string[];
  projects: string[];
  reportsTo?: string;
  directReports: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  contact: {
    phone?: string;
    slack?: string;
  };
  performance?: {
    rating: number;
    completedProjects: number;
    ongoingProjects: number;
  };
}

export interface Department {
  id: string;
  name: DepartmentType;
  description: string;
  headCount: number;
  lead: string;
  budget: number;
  projects: number;
}