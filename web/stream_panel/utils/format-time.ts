export function formatStreamDuration(startDate: string | Date | null): string {
  if (!startDate) return "0m";
  
  const diffMs = Date.now() - new Date(startDate).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
}
