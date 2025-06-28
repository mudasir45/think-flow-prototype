'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AttendanceRecord } from '@/lib/attendance';
import { Badge } from '@/components/ui/badge';

export function AttendanceLog() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem('attendance_records') || '[]');
    setRecords(storedRecords.sort((a: AttendanceRecord, b: AttendanceRecord) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string | null) => {
    return timeString ? new Date(timeString).toLocaleTimeString() : '--:--';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Breaks</TableHead>
            <TableHead>Work Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>{formatTime(record.checkIn)}</TableCell>
              <TableCell>{formatTime(record.checkOut)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {record.breaks.map((breakItem) => (
                    <Badge key={breakItem.id} variant="outline">
                      {breakItem.type}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {record.totalWorkTime ? `${Math.floor(record.totalWorkTime / 60)}h ${record.totalWorkTime % 60}m` : '--'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}