#!/usr/bin/env node

const { parseTimeRange } = require('../lib/date-utils');
const { loadData } = require('./data-parser');
const { calculateMetrics } = require('./metrics-calculator');
const { renderWrapped } = require('./ui-renderer');

/**
 * Main entry point for Claude Code Wrapped
 */
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const periodIndex = args.indexOf('--period');
    const period = periodIndex !== -1 ? args[periodIndex + 1] : 'year';

    // Check for JSON output flag
    const jsonIndex = args.indexOf('--json');
    const jsonPath = jsonIndex !== -1 ? args[jsonIndex + 1] : null;

    // Parse time range
    const timeRange = parseTimeRange(period);

    // Load data
    if (!jsonPath) {
      console.log('Loading your Claude Code data...\n');
    }
    const { stats, history } = loadData(timeRange);

    // Calculate metrics
    const metrics = calculateMetrics(stats, history);

    // Add raw stats for rendering
    metrics.stats = stats;

    if (jsonPath) {
      const fs = require('fs');
      const path = require('path');

      // Ensure directory exists
      const dir = path.dirname(jsonPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(jsonPath, JSON.stringify(metrics, null, 2));
      // Silent success for JSON mode (command wrapper handles output)
    } else {
      // Render the wrapped experience
      await renderWrapped(metrics, timeRange);

      // Done!
      console.log('Thanks for using Claude Code Wrapped! 🎉\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (!process.argv.includes('--json')) {
      console.error('\nMake sure you have used Claude Code before running /wrapped.');
      console.error('Data files are stored in ~/.claude/\n');
    }
    process.exit(1);
  }
}

// Run the main function
main();
