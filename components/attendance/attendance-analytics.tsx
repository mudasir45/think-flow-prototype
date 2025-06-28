'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { AttendanceRecord } from '@/lib/types/attendance';
import { getFromStorage } from '@/lib/utils/storage';
import { formatDuration } from '@/lib/utils/date';
import { CustomXAxis, CustomYAxis } from '@/components/ui/custom-axis';

interface DailyStats {
  date: string;
  workHours: number;
  breakMinutes: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">
          Work Hours: {payload[0].value.toFixed(1)}h
        </p>
      </div>
    );
  }
  return null;
};

export function AttendanceAnalytics() {
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [averageWorkHours, setAverageWorkHours] = useState(0);
  const [averageBreakMinutes, setAverageBreakMinutes] = useState(0);

  useEffect(() => {
    const records = getFromStorage<AttendanceRecord[]>('attendance_records', []);
    const last7Days = getLast7DaysStats(records);
    
    setWeeklyStats(last7Days);
    
    if (last7Days.length > 0) {
      setAverageWorkHours(
        last7Days.reduce((acc, day) => acc + day.workHours, 0) / last7Days.length
      );
      setAverageBreakMinutes(
        last7Days.reduce((acc, day) => acc + day.breakMinutes, 0) / last7Days.length
      );
    }
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Weekly Work Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyStats}>
              <CustomXAxis dataKey="date" />
              <CustomYAxis tickFormatter={(value) => `${value}h`} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="workHours" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="col-span-3 grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Daily Work Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageWorkHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Over the last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Break Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(Math.round(averageBreakMinutes))}</div>
            <p className="text-xs text-muted-foreground">
              Over the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getLast7DaysStats(records: AttendanceRecord[]): DailyStats[] {
  const stats: DailyStats[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const record = records.find(r => r.date === dateStr);
    stats.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      workHours: record ? record.totalWorkTime / 60 : 0,
      breakMinutes: record ? record.totalBreakTime / (1000 * 60) : 0
    });
  }
  
  return stats;
}