/**
 * Formats a date string into a relative "time ago" format.
 * @param dateString - The ISO date string to format.
 * @returns A relative time string (e.g., "just now", "5m", "2h", "1d").
 */
export const formatTimeAgo = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  // Calculate difference in seconds
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month`;
  }

  const years = Math.floor(days / 365);
  return `${years} year`;
};
