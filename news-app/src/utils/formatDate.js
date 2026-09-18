/**
 * Formats a date string into an editorial headline date (e.g., "Friday, September 18, 2026")
 */
export function getTodayHeaderDate() {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date().toLocaleDateString('en-US', options);
}

/**
 * Formats NewsData.io pubDate into a relative human-readable timestamp (e.g., "25m ago", "3h ago")
 * @param {string} dateString
 * @returns {string}
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Recent';

  // Normalize date string (NewsData.io often uses "YYYY-MM-DD HH:mm:ss")
  const normalized = dateString.replace(' ', 'T') + (dateString.includes('Z') ? '' : 'Z');
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    const fallbackDate = new Date(dateString);
    if (isNaN(fallbackDate.getTime())) return 'Recently';
    return fallbackDate.toLocaleDateString();
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Formats a date into full editorial format
 * @param {string} dateString
 * @returns {string}
 */
export function formatEditorialDate(dateString) {
  if (!dateString) return '';
  const normalized = dateString.replace(' ', 'T') + (dateString.includes('Z') ? '' : 'Z');
  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Estimates reading time in minutes based on word count
 * @param {string} text
 * @returns {string}
 */
export function estimateReadingTime(text) {
  if (!text) return '2 min read';
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
