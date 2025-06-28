import { Metadata } from 'next';
import { getProjects } from '@/lib/services/projects';
import { ProjectPageClient } from '@/components/projects/project-page-client';
import { notFound } from 'next/navigation';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

// Generate metadata for each project page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projects = getProjects();
  const project = projects.find(p => p.id === params.id);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Project Details`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const projects = getProjects();
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}