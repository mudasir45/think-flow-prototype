'use client';

import { TasksHeader } from '@/components/tasks/tasks-header';
import { TasksList } from '@/components/tasks/tasks-list';
import { TasksProgress } from '@/components/tasks/tasks-progress';
import { TasksAnalytics } from '@/components/tasks/tasks-analytics';
import { useState } from 'react';
import { TaskView } from '@/lib/types/personal-tasks';
import { TasksKanban } from '@/components/tasks/tasks-kanban';
import { TasksCalendar } from '@/components/tasks/tasks-calendar';

export default function TasksPage() {
  const [view, setView] = useState<TaskView>('list');

  const renderView = () => {
    switch (view) {
      case 'kanban':
        return <TasksKanban />;
      case 'calendar':
        return <TasksCalendar />;
      default:
        return <TasksList />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <TasksHeader view={view} onViewChange={setView} />
      <TasksProgress />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        {renderView()}
        <TasksAnalytics />
      </div>
    </div>
  );
}