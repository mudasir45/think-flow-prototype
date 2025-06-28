'use client';

import { useEffect, useState } from 'react';
import { Sprint } from '@/lib/types/sprints';
import { getSprints } from '@/lib/services/sprints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SprintDialog } from './sprint-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Edit, Plus, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SprintListProps {
  className?: string;
  projectId: string;
}

export function SprintList({ className, projectId }: SprintListProps) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [showNewSprint, setShowNewSprint] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    setSprints(getSprints(projectId));
  }, [projectId]);

  const getStatusColor = (status: Sprint['status']) => {
    const colors: Record<string, string> = {
      'planning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'completed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return colors[status];
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sprints</CardTitle>
        <Button onClick={() => setShowNewSprint(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Sprint
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sprints.map((sprint) => (
            <Card key={sprint.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{sprint.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSprint(sprint)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <Badge className={cn(getStatusColor(sprint.status))}>
                  {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                </Badge>

                {sprint.goal && (
                  <p className="text-sm text-muted-foreground">{sprint.goal}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(sprint.startDate), "MMM d")} -{' '}
                      {format(new Date(sprint.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>

      <SprintDialog
        open={showNewSprint}
        onOpenChange={setShowNewSprint}
        projectId={projectId}
        onSprintCreated={(newSprint) => setSprints([...sprints, newSprint])}
      />

      {editingSprint && (
        <SprintDialog
          open={!!editingSprint}
          onOpenChange={(open) => {
            if (!open) {
              setEditingSprint(null);
              setSprints(getSprints(projectId));
            }
          }}
          projectId={projectId}
          sprint={editingSprint}
          onSprintUpdated={(updatedSprint) => {
            setSprints(sprints.map(s => 
              s.id === updatedSprint.id ? updatedSprint : s
            ));
          }}
        />
      )}
    </Card>
  );
}