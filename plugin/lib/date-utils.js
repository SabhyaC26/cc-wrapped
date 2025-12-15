const { startOfYear, endOfYear, subDays, parseISO, isWithinInterval, format } = require('date-fns');

/**
 * Parse a time period argument and return start/end dates
 * @param {string} arg - Time period argument (year, month, week, all, 2024, etc.)
 * @returns {{start: Date, end: Date, label: string}} Time range with label
 */
function parseTimeRange(arg) {
  const now = new Date();

  if (!arg || arg === 'year') {
    return {
      start: startOfYear(now),
      end: now,
      label: `${now.getFullYear()}`
    };
  }

  if (arg === 'month') {
    const monthAgo = subDays(now, 30);
    return {
      start: monthAgo,
      end: now,
      label: 'Last 30 Days'
    };
  }

  if (arg === 'week') {
    const weekAgo = subDays(now, 7);
    return {
      start: weekAgo,
      end: now,
      label: 'Last 7 Days'
    };
  }

  if (arg === 'all') {
    return {
      start: new Date('2000-01-01'),
      end: now,
      label: 'All Time'
    };
  }

  // Check if it's a specific year (e.g., "2024")
  if (arg.match(/^\d{4}$/)) {
    const year = parseInt(arg);
    return {
      start: startOfYear(new Date(year, 0, 1)),
      end: endOfYear(new Date(year, 11, 31)),
      label: `${year}`
    };
  }

  throw new Error(`Invalid time range: ${arg}. Use: year, month, week, all, or a specific year (e.g., 2024)`);
}

/**
 * Check if a date is within a time range
 * @param {string|Date} date - Date to check
 * @param {{start: Date, end: Date}} range - Time range
 * @returns {boolean} True if date is within range
 */
function isInRange(date, range) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isWithinInterval(dateObj, { start: range.start, end: range.end });
}

/**
 * Check if a timestamp (milliseconds) is within a time range
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @param {{start: Date, end: Date}} range - Time range
 * @returns {boolean} True if timestamp is within range
 */
function isTimestampInRange(timestamp, range) {
  const date = new Date(timestamp);
  return isWithinInterval(date, { start: range.start, end: range.end });
}

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
}

/**
 * Format a date as short month-day (e.g., "Dec 5")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatShortDate(date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d');
}

module.exports = {
  parseTimeRange,
  isInRange,
  isTimestampInRange,
  formatDate,
  formatShortDate
};
