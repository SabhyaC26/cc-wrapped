const chalk = require('chalk');

/**
 * Create a horizontal bar chart
 * @param {Array} data - Array of {label, value} objects
 * @param {number} maxWidth - Maximum width of bars in characters
 * @returns {string} ASCII bar chart
 */
function createBarChart(data, maxWidth = 30) {
  if (data.length === 0) return '';

  const max = Math.max(...data.map(d => d.value));
  if (max === 0) return '';

  return data.map(item => {
    const barLength = Math.floor((item.value / max) * maxWidth);
    const filledBar = '█'.repeat(barLength);
    const emptyBar = '░'.repeat(maxWidth - barLength);
    const bar = chalk.green(filledBar) + chalk.gray(emptyBar);

    return `${item.label.padEnd(12)} ${bar} ${chalk.yellow(item.value)}`;
  }).join('\n');
}

/**
 * Create an activity timeline visualization
 * @param {Array} dailyActivity - Daily activity data with date and messageCount
 * @param {number} maxBars - Maximum number of bars to show
 * @returns {string} Activity timeline
 */
function createActivityTimeline(dailyActivity, maxBars = 40) {
  if (dailyActivity.length === 0) return '';

  // Take the last N days or all if less
  const days = dailyActivity.slice(-maxBars);

  const max = Math.max(...days.map(d => d.messageCount));
  if (max === 0) return '';

  // Create vertical bars
  const bars = days.map(day => {
    const height = Math.floor((day.messageCount / max) * 8);
    if (height === 0) return chalk.gray('░');
    if (height <= 2) return chalk.green('▁');
    if (height <= 4) return chalk.green('▃');
    if (height <= 6) return chalk.yellow('▅');
    return chalk.yellow('█');
  }).join('');

  return bars;
}

/**
 * Create a distribution chart for hours
 * @param {Array} peakHours - Array of {hour, count} objects
 * @param {number} maxWidth - Maximum width of bars
 * @returns {string} Hour distribution chart
 */
function createHourDistribution(peakHours, maxWidth = 30) {
  if (peakHours.length === 0) return '';

  const max = Math.max(...peakHours.map(h => h.count));

  return peakHours.map((item, index) => {
    const barLength = Math.floor((item.count / max) * maxWidth);
    const filledBar = '█'.repeat(barLength);
    const bar = chalk.cyan(filledBar);

    return `${(index + 1)}. ${item.hour.padEnd(7)} ${bar} ${chalk.yellow(`(${item.count} sessions)`)}`;
  }).join('\n');
}

/**
 * Create a simple percentage bar
 * @param {number} percentage - Percentage (0-100)
 * @param {number} width - Width of the bar
 * @returns {string} Percentage bar
 */
function createPercentageBar(percentage, width = 30) {
  const filledLength = Math.floor((percentage / 100) * width);
  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(width - filledLength);

  return chalk.green(filled) + chalk.gray(empty) + ' ' + chalk.yellow(`${percentage}%`);
}

/**
 * Format a large number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Create a sparkline from an array of numbers
 * @param {Array} numbers - Array of numbers
 * @returns {string} Sparkline
 */
function createSparkline(numbers) {
  if (numbers.length === 0) return '';

  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  const range = max - min;

  if (range === 0) return '▄'.repeat(numbers.length);

  const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

  return numbers.map(n => {
    const normalized = (n - min) / range;
    const index = Math.floor(normalized * (chars.length - 1));
    return chars[index];
  }).join('');
}

/**
 * Create a calendar heatmap showing activity by day
 * @param {Array} dailyActivity - Daily activity data with date and messageCount
 * @param {number} weeks - Number of weeks to show (default 8)
 * @returns {string} Calendar heatmap
 */
function createCalendarHeatmap(dailyActivity, weeks = 8) {
  if (dailyActivity.length === 0) return '';

  const { parseISO, format, subDays, startOfWeek } = require('date-fns');

  // Get the most recent data
  const sortedActivity = [...dailyActivity].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  const latestDate = parseISO(sortedActivity[0].date);
  const startDate = subDays(latestDate, weeks * 7 - 1);

  // Create a map of date -> message count
  const activityMap = {};
  dailyActivity.forEach(day => {
    activityMap[day.date] = day.messageCount;
  });

  // Find max for normalization
  const max = Math.max(...dailyActivity.map(d => d.messageCount));

  // Build the heatmap
  const lines = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Header with day labels
  lines.push('    ' + dayLabels.map(d => d.padEnd(4)).join(''));

  // Build weeks
  for (let week = 0; week < weeks; week++) {
    const weekStart = subDays(latestDate, (weeks - week - 1) * 7);
    const weekLabel = format(weekStart, 'MMM d').padEnd(4);
    let weekLine = weekLabel;

    for (let day = 0; day < 7; day++) {
      const currentDate = subDays(weekStart, -day);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const count = activityMap[dateStr] || 0;

      // Choose character based on intensity
      let char;
      if (count === 0) {
        char = chalk.gray('░░');
      } else {
        const intensity = count / max;
        if (intensity < 0.25) char = chalk.green('▓▓');
        else if (intensity < 0.5) char = chalk.yellow('▓▓');
        else if (intensity < 0.75) char = chalk.yellow('██');
        else char = chalk.green('██');
      }

      weekLine += char + '  ';
    }

    lines.push(weekLine);
  }

  return lines.join('\n');
}

/**
 * Create a tool usage breakdown chart
 * @param {Object} toolStats - Object with tool names and counts
 * @param {number} topN - Number of top tools to show
 * @param {number} maxWidth - Maximum width of bars
 * @returns {string} Tool usage chart
 */
function createToolBreakdown(toolStats, topN = 5, maxWidth = 25) {
  if (!toolStats || Object.keys(toolStats).length === 0) return '';

  // Sort by usage and take top N
  const sortedTools = Object.entries(toolStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  const max = Math.max(...sortedTools.map(([, count]) => count));

  return sortedTools.map(([tool, count]) => {
    const barLength = Math.floor((count / max) * maxWidth);
    const filledBar = '█'.repeat(barLength);
    const emptyBar = '░'.repeat(maxWidth - barLength);
    const bar = chalk.cyan(filledBar) + chalk.gray(emptyBar);

    return `${tool.padEnd(12)} ${bar} ${chalk.yellow(count + ' calls')}`;
  }).join('\n');
}

/**
 * Create clean model usage bars (Option 4 style)
 * @param {Array} modelBreakdown - Array of {name, tokens, percentage}
 * @param {number} maxWidth - Maximum width of bars
 * @returns {string} Model usage visualization
 */
function createModelBars(modelBreakdown, maxWidth = 30) {
  if (!modelBreakdown || modelBreakdown.length === 0) return '';

  return modelBreakdown.map(model => {
    const barLength = Math.floor((model.percentage / 100) * maxWidth);
    const filledBar = '█'.repeat(barLength);
    const emptyBar = '░'.repeat(maxWidth - barLength);
    const bar = chalk.green(filledBar) + chalk.gray(emptyBar);

    const tokensFormatted = formatNumber(model.tokens);
    const tokensShort = model.tokens >= 1000
      ? Math.round(model.tokens / 1000) + 'K'
      : model.tokens;

    return `${model.name.padEnd(20)} ${bar}  ${chalk.yellow(model.percentage + '%')}  ${chalk.gray('(' + tokensShort + ' tokens)')}`;
  }).join('\n');
}

module.exports = {
  createBarChart,
  createActivityTimeline,
  createHourDistribution,
  createPercentageBar,
  formatNumber,
  createSparkline,
  createCalendarHeatmap,
  createToolBreakdown,
  createModelBars
};
