import { ProjectsHeader } from '@/components/projects/projects-header';
import { ProjectsList } from '@/components/projects/projects-list';
import { ProjectsProgress } from '@/components/projects/projects-progress';
import { ProjectsAnalytics } from '@/components/projects/projects-analytics';

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProjectsHeader />
      <ProjectsProgress />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <ProjectsList className="col-span-4" />
        <ProjectsAnalytics className="col-span-3" />
      </div>
    </div>
  );
}