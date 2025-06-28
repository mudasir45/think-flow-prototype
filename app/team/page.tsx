'use client';

import { TeamHeader } from '@/components/team/team-header';
import { TeamGrid } from '@/components/team/team-grid';
import { TeamStats } from '@/components/team/team-stats';
import { TeamAnalytics } from '@/components/team/team-analytics';
import { useState } from 'react';
import { TeamView } from '@/lib/types/team';

export default function TeamPage() {
  const [view, setView] = useState<TeamView>('grid');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <TeamHeader view={view} onViewChange={setView} />
      <TeamAnalytics />
      <TeamStats />
      <TeamGrid view={view} />
    </div>
  );
}