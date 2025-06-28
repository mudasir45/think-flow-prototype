'use client';

import { Button } from '@/components/ui/button';
import { Plus, Grid, List } from 'lucide-react';
import { useState } from 'react';
import { TeamMemberDialog } from './team-member-dialog';
import { TeamView } from '@/lib/types/team';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TeamHeaderProps {
  view: TeamView;
  onViewChange: (view: TeamView) => void;
}

export function TeamHeader({ view, onViewChange }: TeamHeaderProps) {
  const [showNewMember, setShowNewMember] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team</h2>
        <p className="text-muted-foreground">
          Manage and collaborate with your team members
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v as TeamView)}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={() => setShowNewMember(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>
      <TeamMemberDialog open={showNewMember} onOpenChange={setShowNewMember} />
    </div>
  );
}