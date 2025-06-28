'use client';

import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AttendanceStatus, BreakType } from '@/lib/types/attendance';
import { checkIn, checkOut, endBreak, getAttendanceStatus, startBreak } from '@/lib/services/attendance';
import { BreakMenu } from './break-menu';
import { formatTime } from '@/lib/utils/date';

export function AttendanceHeader() {
  const [status, setStatus] = useState<AttendanceStatus>('checked-out');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Initialize time on mount
    setCurrentTime(formatTime(new Date().toISOString()));
    
    // Update status and time
    setStatus(getAttendanceStatus());
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date().toISOString()));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    checkIn();
    setStatus('checked-in');
  };

  const handleCheckOut = () => {
    checkOut();
    setStatus('checked-out');
  };

  const handleStartBreak = (type: BreakType) => {
    startBreak(type);
    setStatus('on-break');
  };

  const handleEndBreak = () => {
    endBreak();
    setStatus('checked-in');
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">
          {currentTime}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {status === 'checked-out' && (
          <Button onClick={handleCheckIn}>
            <Clock className="mr-2 h-4 w-4" />
            Check In
          </Button>
        )}
        {status === 'checked-in' && (
          <>
            <BreakMenu onStartBreak={handleStartBreak} />
            <Button variant="destructive" onClick={handleCheckOut}>
              Check Out
            </Button>
          </>
        )}
        {status === 'on-break' && (
          <Button onClick={handleEndBreak}>End Break</Button>
        )}
      </div>
    </div>
  );
}