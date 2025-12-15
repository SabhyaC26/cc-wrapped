const chalk = require('chalk');
const boxen = require('boxen');
const {
  createBarChart,
  createActivityTimeline,
  createHourDistribution,
  createPercentageBar,
  formatNumber,
  createCalendarHeatmap,
  createToolBreakdown,
  createModelBars
} = require('../lib/chart-generator');

/**
 * Render the full Wrapped experience
 * @param {Object} metrics - Calculated metrics
 * @param {{start: Date, end: Date, label: string}} timeRange - Time range
 */
async function renderWrapped(metrics, timeRange) {
  const cards = [
    () => renderTitleCard(timeRange.label),
    () => renderActivityCard(metrics.activity, metrics.stats),
    () => renderTimeCard(metrics.time),
    () => renderModelCard(metrics.model),
    () => renderToolCard(metrics.tools),
    () => renderCommandCard(metrics.commands),
    () => renderInsightsCard(metrics.insights),
    () => renderSummaryCard(metrics, timeRange)
  ];

  for (const renderCard of cards) {
    renderCard();
    console.log('\n');
  }
}

/**
 * Render the title card
 * @param {string} period - Time period label
 */
function renderTitleCard(period) {
  const content = [
    '',
    chalk.bold.cyan('🎉 CLAUDE CODE WRAPPED 🎉'),
    '',
    chalk.white(`Your ${period} in Code`),
    ''
  ].join('\n');

  console.log(boxen(content, {
    padding: 2,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    textAlignment: 'center'
  }));
}

/**
 * Render activity metrics card
 * @param {Object} activity - Activity metrics
 * @param {Object} stats - Raw stats for timeline
 */
function renderActivityCard(activity, stats) {
  const lines = [
    '',
    chalk.bold.cyan('📊 Your Coding Activity'),
    '',
    `You sent ${chalk.yellow(formatNumber(activity.totalMessages))} messages across ${chalk.yellow(activity.totalSessions)} sessions`,
    `Made ${chalk.yellow(formatNumber(activity.totalToolCalls))} tool calls`,
    `Active on ${chalk.yellow(activity.daysActive)} unique days`,
    ''
  ];

  // Add calendar heatmap if we have data
  if (stats && stats.dailyActivity && stats.dailyActivity.length > 0) {
    lines.push(chalk.bold('Activity Calendar:'));
    lines.push(createCalendarHeatmap(stats.dailyActivity, 4));
    lines.push('');
  }

  // Add most active day
  if (activity.mostActiveDay) {
    lines.push(`Most active day: ${chalk.yellow(activity.mostActiveDay.date)} (${activity.mostActiveDay.messageCount} messages)`);
    lines.push('');
  }

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    title: 'Activity',
    titleAlignment: 'left'
  }));
}

/**
 * Render time analytics card
 * @param {Object} time - Time metrics
 */
function renderTimeCard(time) {
  const lines = [
    '',
    chalk.bold.cyan('⏰ Your Peak Coding Hours'),
    ''
  ];

  if (time.peakHours && time.peakHours.length > 0) {
    lines.push('You code most at:');
    lines.push(createHourDistribution(time.peakHours));
    lines.push('');
  }

  if (time.persona) {
    lines.push(`Your Persona: ${time.persona.emoji} ${chalk.yellow(time.persona.name)}`);
    lines.push(chalk.gray(`(${time.persona.description})`));
    lines.push('');
  }

  if (time.busiestDayOfWeek) {
    lines.push(`Busiest day: ${chalk.yellow(time.busiestDayOfWeek)}`);
    lines.push('');
  }

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
    title: 'Peak Hours',
    titleAlignment: 'left'
  }));
}

/**
 * Render model usage card
 * @param {Object} model - Model metrics
 */
function renderModelCard(model) {
  const lines = [
    '',
    chalk.bold.cyan('🤖 Your AI Companions'),
    ''
  ];

  // Use clean bar style for model breakdown
  if (model.modelBreakdown && model.modelBreakdown.length > 0) {
    lines.push(createModelBars(model.modelBreakdown));
    lines.push('');
  }

  lines.push(`Total Tokens: ${chalk.yellow(formatNumber(model.totalTokens))}`);

  if (model.cacheEfficiency) {
    lines.push(`Cache Hits: ${chalk.yellow(formatNumber(model.cacheEfficiency.cacheReadTokens))} tokens`);
    lines.push(`Cache Efficiency: ${chalk.yellow(model.cacheEfficiency.efficiencyRatio + 'x')}`);
  }

  lines.push('');

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'magenta',
    title: 'Model Usage',
    titleAlignment: 'left'
  }));
}

/**
 * Render tool usage card
 * @param {Object} tools - Tool metrics
 */
function renderToolCard(tools) {
  if (!tools || !tools.topTools || tools.topTools.length === 0) {
    return; // Skip if no tool data
  }

  const lines = [
    '',
    chalk.bold.cyan('🛠️  Your Favorite Tools'),
    ''
  ];

  lines.push(createToolBreakdown(tools.toolBreakdown, 5));
  lines.push('');

  if (tools.totalToolCalls > 0) {
    lines.push(`Total tool calls: ${chalk.yellow(formatNumber(tools.totalToolCalls))}`);
    lines.push('');
  }

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title: 'Tools',
    titleAlignment: 'left'
  }));
}

/**
 * Render top commands card
 * @param {Object} commands - Command metrics
 */
function renderCommandCard(commands) {
  const lines = [
    '',
    chalk.bold.cyan('🔧 Your Top Commands'),
    ''
  ];

  if (commands.topCommands && commands.topCommands.length > 0) {
    const chartData = commands.topCommands.map(cmd => ({
      label: cmd.command,
      value: cmd.count
    }));
    lines.push(createBarChart(chartData));
    lines.push('');
  } else {
    lines.push(chalk.gray('No command history available'));
    lines.push('');
  }

  if (commands.commandDiversity > 0) {
    lines.push(`Command Diversity: ${chalk.yellow(commands.commandDiversity)} unique commands`);
    lines.push('');
  }

  if (commands.mostActiveProject) {
    lines.push(`Most Active Project: ${chalk.yellow(commands.mostActiveProject.name)}`);
    lines.push(chalk.gray(commands.mostActiveProject.path));
    lines.push('');
  }

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'blue',
    title: 'Commands',
    titleAlignment: 'left'
  }));
}

/**
 * Render insights card
 * @param {Array} insights - Generated insights
 */
function renderInsightsCard(insights) {
  if (!insights || insights.length === 0) {
    return;
  }

  const lines = [
    '',
    chalk.bold.cyan('💡 Special Achievements'),
    ''
  ];

  insights.forEach(insight => {
    lines.push(chalk.yellow(`🏆 ${insight.title}`));
    lines.push(chalk.gray(insight.description));
    lines.push('');
  });

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
    title: 'Achievements',
    titleAlignment: 'left'
  }));
}

/**
 * Render summary card
 * @param {Object} metrics - All metrics
 * @param {{start: Date, end: Date, label: string}} timeRange - Time range
 */
function renderSummaryCard(metrics, timeRange) {
  const { activity } = metrics;

  const lines = [
    '',
    chalk.bold.cyan(`🎯 Your ${timeRange.label} Summary`),
    ''
  ];

  if (activity.longestSession) {
    lines.push(`🏆 Longest Session: ${chalk.yellow(activity.longestSession.messageCount)} messages over ${chalk.yellow(activity.longestSession.durationHours)} hours`);
    lines.push(chalk.gray(`   On ${activity.longestSession.date}`));
    lines.push('');
  }

  if (activity.longestStreak > 1) {
    lines.push(`🔥 Longest Streak: ${chalk.yellow(activity.longestStreak)} days`);
    lines.push('');
  }

  lines.push(chalk.green('Keep coding! 🚀'));
  lines.push('');

  const content = lines.join('\n');

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    title: 'Summary',
    titleAlignment: 'center'
  }));
}

module.exports = {
  renderWrapped
};
