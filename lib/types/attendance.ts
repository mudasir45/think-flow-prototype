export type AttendanceStatus = 'checked-in' | 'checked-out' | 'on-break';
export type BreakType = 'lunch' | 'coffee' | 'other';

export interface Break {
  id: string;
  type: BreakType;
  startTime: string;
  endTime: string | null;
}

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