'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Circle } from 'lucide-react';

const activities = [
  {
    user: 'John Doe',
    action: 'completed task',
    target: 'Update landing page',
    time: '2 minutes ago',
  },
  {
    user: 'Sarah Smith',
    action: 'created project',
    target: 'Mobile App Redesign',
    time: '1 hour ago',
  },
  {
    user: 'Mike Johnson',
    action: 'commented on',
    target: 'Backend API Documentation',
    time: '3 hours ago',
  },
  {
    user: 'Emily Brown',
    action: 'completed goal',
    target: 'Q1 Sales Target',
    time: '5 hours ago',
  },
];

export function RecentActivity() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-center">
            <Circle className="h-2 w-2 mr-2 fill-primary stroke-primary" />
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}