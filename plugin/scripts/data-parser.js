const fs = require('fs');
const path = require('path');
const os = require('os');
const { isInRange, isTimestampInRange } = require('../lib/date-utils');

/**
 * Get the path to Claude Code's stats cache file
 * @returns {string} Path to stats-cache.json
 */
function getStatsPath() {
  return path.join(os.homedir(), '.claude', 'stats-cache.json');
}

/**
 * Get the path to Claude Code's history file
 * @returns {string} Path to history.jsonl
 */
function getHistoryPath() {
  return path.join(os.homedir(), '.claude', 'history.jsonl');
}

/**
 * Parse and filter stats-cache.json for a time range
 * @param {{start: Date, end: Date}} timeRange - Time range to filter
 * @returns {Object} Filtered stats data
 */
function parseStatsCache(timeRange) {
  const statsPath = getStatsPath();

  if (!fs.existsSync(statsPath)) {
    throw new Error(`Stats file not found at ${statsPath}. Have you used Claude Code yet?`);
  }

  const rawData = fs.readFileSync(statsPath, 'utf8');
  const stats = JSON.parse(rawData);

  // Filter daily activity by time range
  const filteredActivity = stats.dailyActivity.filter(day =>
    isInRange(day.date, timeRange)
  );

  // Filter daily model tokens by time range
  const filteredModelTokens = stats.dailyModelTokens.filter(day =>
    isInRange(day.date, timeRange)
  );

  // Return filtered stats
  return {
    dailyActivity: filteredActivity,
    dailyModelTokens: filteredModelTokens,
    modelUsage: stats.modelUsage,
    totalSessions: stats.totalSessions,
    totalMessages: stats.totalMessages,
    longestSession: stats.longestSession,
    firstSessionDate: stats.firstSessionDate,
    hourCounts: stats.hourCounts,
    // Add raw stats for reference
    _raw: stats
  };
}

/**
 * Parse and filter history.jsonl for a time range
 * @param {{start: Date, end: Date}} timeRange - Time range to filter
 * @returns {Array} Filtered history entries
 */
function parseHistory(timeRange) {
  const historyPath = getHistoryPath();

  if (!fs.existsSync(historyPath)) {
    console.warn(`History file not found at ${historyPath}. Command stats will be limited.`);
    return [];
  }

  const rawData = fs.readFileSync(historyPath, 'utf8');

  // Parse JSONL (one JSON object per line)
  const history = rawData
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (err) {
        console.warn('Failed to parse history line:', err.message);
        return null;
      }
    })
    .filter(entry => entry !== null);

  // Filter by time range
  const filteredHistory = history.filter(entry =>
    isTimestampInRange(entry.timestamp, timeRange)
  );

  return filteredHistory;
}

/**
 * Load and filter all data for a time range
 * @param {{start: Date, end: Date}} timeRange - Time range to filter
 * @returns {{stats: Object, history: Array}} All filtered data
 */
function loadData(timeRange) {
  const stats = parseStatsCache(timeRange);
  const history = parseHistory(timeRange);

  return {
    stats,
    history
  };
}

module.exports = {
  parseStatsCache,
  parseHistory,
  loadData,
  getStatsPath,
  getHistoryPath
};
