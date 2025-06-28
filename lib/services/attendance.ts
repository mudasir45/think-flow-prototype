import { AttendanceRecord, AttendanceStatus, Break, BreakType } from '../types/attendance';
import { getFromStorage, setToStorage } from '../utils/storage';

const STORAGE_KEYS = {
  RECORDS: 'attendance_records',
  STATUS: 'attendance_status'
} as const;

export const getAttendanceStatus = (): AttendanceStatus => {
  return getFromStorage<AttendanceStatus>(STORAGE_KEYS.STATUS, 'checked-out');
};

export const getCurrentDayRecord = (): AttendanceRecord | null => {
  const today = new Date().toISOString().split('T')[0];
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.RECORDS, []);
  return records.find((record) => record.date === today) || null;
};

export const checkIn = () => {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.RECORDS, []);

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

  setToStorage(STORAGE_KEYS.RECORDS, [...records, newRecord]);
  setToStorage(STORAGE_KEYS.STATUS, 'checked-in');
};

export const checkOut = () => {
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.RECORDS, []);
  const currentRecord = getCurrentDayRecord();

  if (currentRecord) {
    const now = new Date().toISOString();
    const updatedRecord = {
      ...currentRecord,
      checkOut: now,
      totalWorkTime: calculateWorkTime(currentRecord.checkIn, now, currentRecord.breaks),
    };

    const updatedRecords = records.map((record) =>
      record.id === currentRecord.id ? updatedRecord : record
    );

    setToStorage(STORAGE_KEYS.RECORDS, updatedRecords);
    setToStorage(STORAGE_KEYS.STATUS, 'checked-out');
  }
};

export const startBreak = (type: BreakType) => {
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.RECORDS, []);
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

    const updatedRecords = records.map((record) =>
      record.id === currentRecord.id ? updatedRecord : record
    );

    setToStorage(STORAGE_KEYS.RECORDS, updatedRecords);
    setToStorage(STORAGE_KEYS.STATUS, 'on-break');
  }
};

export const endBreak = () => {
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.RECORDS, []);
  const currentRecord = getCurrentDayRecord();

  if (currentRecord) {
    const currentBreak = currentRecord.breaks.find((b) => !b.endTime);
    if (currentBreak) {
      const now = new Date().toISOString();
      const updatedBreaks = currentRecord.breaks.map((b) =>
        b.id === currentBreak.id ? { ...b, endTime: now } : b
      );

      const updatedRecord = {
        ...currentRecord,
        breaks: updatedBreaks,
        totalBreakTime: calculateTotalBreakTime(updatedBreaks),
      };

      const updatedRecords = records.map((record) =>
        record.id === currentRecord.id ? updatedRecord : record
      );

      setToStorage(STORAGE_KEYS.RECORDS, updatedRecords);
      setToStorage(STORAGE_KEYS.STATUS, 'checked-in');
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
      return (
        total +
        (new Date(breakItem.endTime).getTime() - new Date(breakItem.startTime).getTime())
      );
    }
    return total;
  }, 0);
};