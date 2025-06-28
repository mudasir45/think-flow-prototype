'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { AttendanceRecord, getCurrentDayRecord } from '@/lib/attendance';

export function AttendanceStats() {
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const record = getCurrentDayRecord();
    setTodayRecord(record);

    const interval = setInterval(() => {
      const updatedRecord = getCurrentDayRecord();
      setTodayRecord(updatedRecord);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Check-in Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayRecord?.checkIn
              ? new Date(todayRecord.checkIn).toLocaleTimeString()
              : '--:--'}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Work Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayRecord?.totalWorkTime
              ? formatTime(todayRecord.totalWorkTime)
              : '0h 0m'}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Break Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayRecord?.totalBreakTime
              ? formatTime(Math.floor(todayRecord.totalBreakTime / (1000 * 60)))
              : '0h 0m'}
          </div>
        </CardContent>
      </Card>
    </>
  );
}