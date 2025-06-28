import { AttendanceHeader } from '@/components/attendance/attendance-header';
import { AttendanceLog } from '@/components/attendance/attendance-log';
import { AttendanceStats } from '@/components/attendance/attendance-stats';
import { AttendanceAnalytics } from '@/components/attendance/attendance-analytics';

export default function AttendancePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AttendanceHeader />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AttendanceStats />
      </div>
      <AttendanceAnalytics />
      <AttendanceLog />
    </div>
  );
}