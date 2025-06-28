export type AttendanceStatus = 'checked-in' | 'checked-out' | 'on-break';
export type BreakType = 'lunch' | 'coffee' | 'other';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  breaks: Break[];
  totalWorkTime: number;
  totalBreakTime: number;
}

export interface Break {
  id: string;
  type: BreakType;
  startTime: string;
  endTime: string | null;
}

export const getAttendanceStatus = (): AttendanceStatus => {
  const status = localStorage.getItem('attendance_status');
  return (status as AttendanceStatus) || 'checked-out';
};

export const getCurrentDayRecord = (): AttendanceRecord | null => {
  const today = new Date().toISOString().split('T')[0];
  const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
  return records.find((record: AttendanceRecord) => record.date === today) || null;
};

export const checkIn = () => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();
  const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');

  const newRecord: AttendanceRecord = {
    id: crypto.randomUUID(),
    userId: 'user123', // In real app, this would come from auth
    date: today,
    checkIn: now,
    checkOut: null,
    breaks: [],
    totalWorkTime: 0,
    totalBreakTime: 0,
  };

  localStorage.setItem('attendance_records', JSON.stringify([...records, newRecord]));
  localStorage.setItem('attendance_status', 'checked-in');
};

export const checkOut = () => {
  const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
  const currentRecord = getCurrentDayRecord();

  if (currentRecord) {
    const now = new Date().toISOString();
    const updatedRecord = {
      ...currentRecord,
      checkOut: now,
      totalWorkTime: calculateWorkTime(currentRecord.checkIn, now, currentRecord.breaks),
    };

    const updatedRecords = records.map((record: AttendanceRecord) =>
      record.id === currentRecord.id ? updatedRecord : record
    );

    localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
    localStorage.setItem('attendance_status', 'checked-out');
  }
};

export const startBreak = (type: BreakType) => {
  const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
  const currentRecord = getCurrentDayRecord();

  if (currentRecord) {
    const newBreak: Break = {
      id: crypto.randomUUID(),
      type,
      startTime: new Date().toISOString(),
      endTime: null,
    };

    const updatedRecord = {
      ...currentRecord,
      breaks: [...currentRecord.breaks, newBreak],
    };

    const updatedRecords = records.map((record: AttendanceRecord) =>
      record.id === currentRecord.id ? updatedRecord : record
    );

    localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
    localStorage.setItem('attendance_status', 'on-break');
  }
};

export const endBreak = () => {
  const records = JSON.parse(localStorage.getItem('attendance_records') || '[]');
  const currentRecord = getCurrentDayRecord();

  if (currentRecord) {
    const currentBreak = currentRecord.breaks.find(b => !b.endTime);
    if (currentBreak) {
      const now = new Date().toISOString();
      const updatedBreaks = currentRecord.breaks.map(b =>
        b.id === currentBreak.id ? { ...b, endTime: now } : b
      );

      const updatedRecord = {
        ...currentRecord,
        breaks: updatedBreaks,
        totalBreakTime: calculateTotalBreakTime(updatedBreaks),
      };

      const updatedRecords = records.map((record: AttendanceRecord) =>
        record.id === currentRecord.id ? updatedRecord : record
      );

      localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
      localStorage.setItem('attendance_status', 'checked-in');
    }
  }
};

const calculateWorkTime = (checkIn: string, checkOut: string, breaks: Break[]): number => {
  const totalTime = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const breakTime = calculateTotalBreakTime(breaks);
  return Math.floor((totalTime - breakTime) / (1000 * 60)); // Return minutes
};

const calculateTotalBreakTime = (breaks: Break[]): number => {
  return breaks.reduce((total, breakItem) => {
    if (breakItem.endTime) {
      return total + (new Date(breakItem.endTime).getTime() - new Date(breakItem.startTime).getTime());
    }
    return total;
  }, 0);
};