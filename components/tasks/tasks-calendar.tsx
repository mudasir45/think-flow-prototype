'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types/personal-tasks';
import { getTasks } from '@/lib/services/personal-tasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export function TasksCalendar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      setSelectedDayTasks(dayTasks);
    }
  }, [selectedDate, tasks]);

  return (
    <div className="col-span-7 grid grid-cols-7 gap-4">
      <div className="col-span-5">
        <Card>
          <CardHeader>
            <CardTitle>Task Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>
            Tasks for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Day"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDayTasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks scheduled for this day</p>
            ) : (
              selectedDayTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge>{task.priority}</Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                  </div>
                  <Badge
                    variant={task.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {task.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}