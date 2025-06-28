export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (timeString: string | null): string => {
  return timeString ? new Date(timeString).toLocaleTimeString() : '--:--';
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};