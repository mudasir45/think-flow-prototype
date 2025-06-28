export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  
  try {
    // Handle primitive string values that shouldn't be parsed
    if (item === 'checked-in' || item === 'checked-out' || item === 'on-break') {
      return item as T;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

export const setToStorage = (key: string, value: unknown): void => {
  if (typeof window === 'undefined') return;
  
  // Handle primitive string values that shouldn't be stringified
  const storageValue = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, storageValue);
};