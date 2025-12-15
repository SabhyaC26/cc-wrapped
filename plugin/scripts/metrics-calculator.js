const { parseISO, differenceInDays, format } = require('date-fns');
const { formatDate } = require('../lib/date-utils');

/**
 * Calculate all metrics from stats and history data
 * @param {Object} stats - Filtered stats data
 * @param {Array} history - Filtered history entries
 * @returns {Object} Calculated metrics
 */
function calculateMetrics(stats, history) {
  const activityMetrics = calculateActivityMetrics(stats);
  const timeMetrics = calculateTimeMetrics(stats);
  const modelMetrics = calculateModelMetrics(stats);
  const commandMetrics = calculateCommandMetrics(history);
  const insights = generateInsights(activityMetrics, timeMetrics, modelMetrics, commandMetrics);

  return {
    activity: activityMetrics,
    time: timeMetrics,
    model: modelMetrics,
    commands: commandMetrics,
    insights
  };
}

/**
 * Calculate activity-related metrics
 * @param {Object} stats - Stats data
 * @returns {Object} Activity metrics
 */
function calculateActivityMetrics(stats) {
  const { dailyActivity } = stats;

  // Total messages, sessions, tool calls
  const totalMessages = dailyActivity.reduce((sum, day) => sum + day.messageCount, 0);
  const totalSessions = dailyActivity.reduce((sum, day) => sum + day.sessionCount, 0);
  const totalToolCalls = dailyActivity.reduce((sum, day) => sum + day.toolCallCount, 0);

  // Average messages per session
  const avgMessagesPerSession = totalSessions > 0
    ? Math.round(totalMessages / totalSessions)
    : 0;

  // Most active day
  const mostActiveDay = dailyActivity.reduce((max, day) =>
    day.messageCount > (max?.messageCount || 0) ? day : max,
    null
  );

  // Days active
  const daysActive = dailyActivity.length;

  // Calculate longest streak
  const streak = calculateStreak(dailyActivity);

  // Longest session info
  const longestSession = stats.longestSession ? {
    messageCount: stats.longestSession.messageCount,
    duration: stats.longestSession.duration,
    durationHours: Math.round(stats.longestSession.duration / 1000 / 60 / 60),
    date: formatDate(stats.longestSession.timestamp)
  } : null;

  return {
    totalMessages,
    totalSessions,
    totalToolCalls,
    avgMessagesPerSession,
    mostActiveDay: mostActiveDay ? {
      date: formatDate(mostActiveDay.date),
      messageCount: mostActiveDay.messageCount
    } : null,
    daysActive,
    longestStreak: streak,
    longestSession
  };
}

/**
 * Calculate coding streak (consecutive days)
 * @param {Array} dailyActivity - Daily activity data
 * @returns {number} Longest streak in days
 */
function calculateStreak(dailyActivity) {
  if (dailyActivity.length === 0) return 0;

  // Sort by date
  const sorted = [...dailyActivity].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = parseISO(sorted[i - 1].date);
    const currDate = parseISO(sorted[i].date);
    const daysDiff = differenceInDays(currDate, prevDate);

    if (daysDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Calculate time-related metrics
 * @param {Object} stats - Stats data
 * @returns {Object} Time metrics
 */
function calculateTimeMetrics(stats) {
  const { hourCounts } = stats;

  // Get top 3 peak hours
  const hourEntries = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const peakHours = hourEntries.map(({ hour, count }) => ({
    hour: formatHour(hour),
    hourNum: hour,
    count
  }));

  // Determine coding persona
  const persona = determinePersona(hourCounts);

  // Calculate busiest day of week (if we have enough data)
  const busiestDayOfWeek = calculateBusiestDayOfWeek(stats.dailyActivity);

  return {
    peakHours,
    persona,
    busiestDayOfWeek
  };
}

/**
 * Format hour (0-23) as human-readable time
 * @param {number} hour - Hour (0-23)
 * @returns {string} Formatted hour
 */
function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Determine coding persona based on hour distribution
 * @param {Object} hourCounts - Hour counts
 * @returns {Object} Persona info
 */
function determinePersona(hourCounts) {
  const hours = Object.entries(hourCounts).map(([h, count]) => ({
    hour: parseInt(h),
    count
  }));

  // Calculate total activity in different time periods
  const nightOwlHours = hours.filter(h => h.hour >= 22 || h.hour <= 4)
    .reduce((sum, h) => sum + h.count, 0);
  const earlyBirdHours = hours.filter(h => h.hour >= 5 && h.hour <= 11)
    .reduce((sum, h) => sum + h.count, 0);
  const afternoonHours = hours.filter(h => h.hour >= 12 && h.hour <= 17)
    .reduce((sum, h) => sum + h.count, 0);

  if (nightOwlHours > earlyBirdHours && nightOwlHours > afternoonHours) {
    return {
      name: 'Night Owl',
      emoji: '🦉',
      description: 'Peak productivity after dark'
    };
  } else if (earlyBirdHours > afternoonHours) {
    return {
      name: 'Morning Architect',
      emoji: '🌅',
      description: 'Peak productivity in early hours'
    };
  } else {
    return {
      name: 'Afternoon Optimizer',
      emoji: '☀️',
      description: 'Peak productivity in afternoon'
    };
  }
}

/**
 * Calculate busiest day of week
 * @param {Array} dailyActivity - Daily activity data
 * @returns {string|null} Busiest day name
 */
function calculateBusiestDayOfWeek(dailyActivity) {
  if (dailyActivity.length === 0) return null;

  const dayOfWeekCounts = {};

  dailyActivity.forEach(day => {
    const date = parseISO(day.date);
    const dayName = format(date, 'EEEE'); // Monday, Tuesday, etc.
    dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + day.messageCount;
  });

  const busiestDay = Object.entries(dayOfWeekCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return busiestDay ? busiestDay[0] : null;
}

/**
 * Calculate model usage metrics
 * @param {Object} stats - Stats data
 * @returns {Object} Model metrics
 */
function calculateModelMetrics(stats) {
  const { dailyModelTokens } = stats;

  // Aggregate token usage by model
  const modelTokens = {};

  dailyModelTokens.forEach(day => {
    Object.entries(day.tokensByModel).forEach(([model, tokens]) => {
      modelTokens[model] = (modelTokens[model] || 0) + tokens;
    });
  });

  // Determine preferred model
  const modelEntries = Object.entries(modelTokens)
    .sort((a, b) => b[1] - a[1]);

  const preferredModel = modelEntries.length > 0 ? {
    name: formatModelName(modelEntries[0][0]),
    tokens: modelEntries[0][1],
    percentage: calculatePercentage(modelEntries[0][1], modelEntries)
  } : null;

  // Total tokens
  const totalTokens = Object.values(modelTokens).reduce((sum, t) => sum + t, 0);

  // Cache efficiency (from raw model usage)
  const cacheEfficiency = calculateCacheEfficiency(stats.modelUsage);

  return {
    preferredModel,
    totalTokens,
    cacheEfficiency,
    modelBreakdown: modelEntries.map(([name, tokens]) => ({
      name: formatModelName(name),
      tokens,
      percentage: calculatePercentage(tokens, modelEntries)
    }))
  };
}

/**
 * Format model name for display
 * @param {string} modelId - Model ID
 * @returns {string} Formatted name
 */
function formatModelName(modelId) {
  if (modelId.includes('opus')) return 'Claude Opus 4.5';
  if (modelId.includes('sonnet')) return 'Claude Sonnet 4.5';
  return modelId;
}

/**
 * Calculate percentage for a model
 * @param {number} tokens - Tokens for this model
 * @param {Array} allModels - All model entries
 * @returns {number} Percentage (0-100)
 */
function calculatePercentage(tokens, allModels) {
  const total = allModels.reduce((sum, [, t]) => sum + t, 0);
  return total > 0 ? Math.round((tokens / total) * 100) : 0;
}

/**
 * Calculate cache efficiency
 * @param {Object} modelUsage - Model usage stats
 * @returns {Object|null} Cache efficiency info
 */
function calculateCacheEfficiency(modelUsage) {
  if (!modelUsage) return null;

  let totalCacheRead = 0;
  let totalCacheCreation = 0;

  Object.values(modelUsage).forEach(usage => {
    totalCacheRead += usage.cacheReadInputTokens || 0;
    totalCacheCreation += usage.cacheCreationInputTokens || 0;
  });

  if (totalCacheCreation === 0) return null;

  const efficiency = Math.round(totalCacheRead / totalCacheCreation);

  return {
    cacheReadTokens: totalCacheRead,
    cacheCreationTokens: totalCacheCreation,
    efficiencyRatio: efficiency
  };
}

/**
 * Calculate command-related metrics
 * @param {Array} history - History entries
 * @returns {Object} Command metrics
 */
function calculateCommandMetrics(history) {
  if (history.length === 0) {
    return {
      topCommands: [],
      commandDiversity: 0,
      totalCommands: 0,
      mostActiveProject: null
    };
  }

  // Count command frequency
  const commandCounts = {};
  const projectCounts = {};

  history.forEach(entry => {
    const display = entry.display || '';

    // Extract command (e.g., "/plugin", "/clear")
    const commandMatch = display.match(/^\/(\w+)/);
    if (commandMatch) {
      const command = commandMatch[0];
      commandCounts[command] = (commandCounts[command] || 0) + 1;
    }

    // Count projects
    if (entry.project) {
      projectCounts[entry.project] = (projectCounts[entry.project] || 0) + 1;
    }
  });

  // Top 5 commands
  const topCommands = Object.entries(commandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cmd, count]) => ({ command: cmd, count }));

  // Command diversity (unique commands)
  const commandDiversity = Object.keys(commandCounts).length;

  // Most active project
  const mostActiveProject = Object.entries(projectCounts)
    .sort((a, b) => b[1] - a[1])[0];

  const mostActiveProjectInfo = mostActiveProject ? {
    path: mostActiveProject[0],
    name: mostActiveProject[0].split('/').pop() || mostActiveProject[0],
    count: mostActiveProject[1]
  } : null;

  return {
    topCommands,
    commandDiversity,
    totalCommands: history.length,
    mostActiveProject: mostActiveProjectInfo
  };
}

/**
 * Generate insights and special achievements
 * @param {Object} activity - Activity metrics
 * @param {Object} time - Time metrics
 * @param {Object} model - Model metrics
 * @param {Object} commands - Command metrics
 * @returns {Object} Insights
 */
function generateInsights(activity, time, model, commands) {
  const insights = [];

  // Dedication insight
  if (activity.longestSession && activity.longestSession.durationHours > 10) {
    insights.push({
      title: 'Marathon Coder',
      description: `Your longest session lasted ${activity.longestSession.durationHours} hours! That's dedication!`
    });
  }

  // Streak insight
  if (activity.longestStreak >= 7) {
    insights.push({
      title: 'Consistency Champion',
      description: `${activity.longestStreak} day coding streak! You're on fire!`
    });
  }

  // Command diversity insight
  if (commands.commandDiversity >= 10) {
    insights.push({
      title: 'Feature Explorer',
      description: `You used ${commands.commandDiversity} different commands. You know Claude Code well!`
    });
  } else if (commands.topCommands.length > 0 && commands.topCommands[0].command === '/plugin') {
    insights.push({
      title: 'Plugin Enthusiast',
      description: `You love exploring plugins! /plugin was your top command.`
    });
  }

  // Productivity insight
  if (activity.avgMessagesPerSession > 50) {
    insights.push({
      title: 'Power User',
      description: `Average of ${activity.avgMessagesPerSession} messages per session. You get things done!`
    });
  }

  return insights;
}

module.exports = {
  calculateMetrics
};
