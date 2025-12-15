# Claude Code Wrapped

Spotify Wrapped-style year-in-review for Claude Code! Visualize your coding activity, patterns, and insights with beautiful terminal UI.

## Features

- **Activity Metrics**: Messages, sessions, tool calls, and activity timeline
- **Time Analytics**: Peak coding hours, coding persona (Night Owl, Morning Architect, etc.), busiest day
- **Model Usage**: Preferred model (Opus vs Sonnet), token usage, cache efficiency
- **Command Analytics**: Top slash commands, command diversity, most active project
- **Special Achievements**: Unlock achievements like Marathon Coder, Consistency Champion, and more
- **Interactive Terminal UI**: Beautiful boxed cards with colors and ASCII charts

## Installation

### Local Installation

```bash
cd /Users/sabhyachhabria/Desktop/cc-wrapped
npm install

# Add to Claude Code plugins
claude plugin marketplace add /Users/sabhyachhabria/Desktop/cc-wrapped
claude plugin install cc-wrapped
```

### From GitHub (Future)

```bash
claude plugin marketplace add username/cc-wrapped
claude plugin install cc-wrapped
```

## Usage

Run the `/wrapped` command with optional time period:

```bash
# Current year (default)
/wrapped

# Last 30 days
/wrapped month

# Last 7 days
/wrapped week

# All-time stats
/wrapped all

# Specific year
/wrapped 2024
```

## Example Output

The plugin displays an interactive series of cards showing:

1. **Title Card**: Welcome message with time period
2. **Activity Card**: Total messages, sessions, tool calls, activity timeline
3. **Peak Hours Card**: Top 3 coding hours, coding persona, busiest day
4. **Model Usage Card**: Preferred AI model, token usage, cache efficiency
5. **Top Commands Card**: Most-used slash commands with bar charts
6. **Achievements Card**: Special achievements and insights
7. **Summary Card**: Longest session, streak, and final message

Press Enter to progress through each card!

## Data Sources

Claude Code Wrapped analyzes data from:

- `~/.claude/stats-cache.json` - Activity metrics, model usage, hour distribution
- `~/.claude/history.jsonl` - Command history and project activity

No background tracking required - all analysis is done on-demand!

## Requirements

- Node.js 14+
- Claude Code CLI
- Active Claude Code usage (to have data to analyze)

## Dependencies

- `chalk` - Terminal colors and styling
- `boxen` - Beautiful bordered boxes
- `asciichart` - ASCII chart generation
- `date-fns` - Date manipulation and formatting
- `readline-sync` - Interactive terminal prompts

## Development

### Project Structure

```
cc-wrapped/
├── plugin/
│   ├── .claude-plugin/
│   │   └── plugin.json           # Plugin metadata
│   ├── commands/
│   │   └── wrapped.md            # /wrapped command definition
│   ├── scripts/
│   │   ├── wrapped-analyzer.js   # Main entry point
│   │   ├── data-parser.js        # Parse stats and history
│   │   ├── metrics-calculator.js # Calculate all metrics
│   │   └── ui-renderer.js        # Terminal UI rendering
│   └── lib/
│       ├── chart-generator.js    # ASCII chart utilities
│       └── date-utils.js         # Time range filtering
├── package.json
└── README.md
```

### Running Locally

```bash
# Install dependencies
npm install

# Run directly
node plugin/scripts/wrapped-analyzer.js --period all

# Make executable
chmod +x plugin/scripts/wrapped-analyzer.js
./plugin/scripts/wrapped-analyzer.js --period week
```

### Testing Different Time Periods

```bash
# Test all-time stats
node plugin/scripts/wrapped-analyzer.js --period all

# Test current year
node plugin/scripts/wrapped-analyzer.js --period year

# Test last 30 days
node plugin/scripts/wrapped-analyzer.js --period month

# Test last week
node plugin/scripts/wrapped-analyzer.js --period week

# Test specific year
node plugin/scripts/wrapped-analyzer.js --period 2024
```

## Metrics Explained

### Activity Metrics
- **Total Messages**: All messages sent to Claude Code
- **Total Sessions**: Number of unique coding sessions
- **Total Tool Calls**: Number of tool executions (Read, Write, Edit, etc.)
- **Average Messages per Session**: Productivity indicator
- **Most Active Day**: Day with highest message count
- **Days Active**: Total unique days with activity
- **Longest Streak**: Consecutive days of coding

### Time Analytics
- **Peak Hours**: Top 3 hours with most activity
- **Coding Persona**: Classification based on active hours
  - Night Owl: Active 10 PM - 4 AM
  - Morning Architect: Active 5 AM - 11 AM
  - Afternoon Optimizer: Active 12 PM - 5 PM
- **Busiest Day**: Day of week with most activity

### Model Usage
- **Preferred Model**: Most-used Claude model (Opus 4.5 or Sonnet 4.5)
- **Total Tokens**: Sum of all input/output tokens
- **Cache Efficiency**: Ratio of cache reads to cache creation

### Command Analytics
- **Top Commands**: Most frequently used slash commands
- **Command Diversity**: Number of unique commands used
- **Most Active Project**: Project directory with most activity

### Achievements
Unlock special achievements based on your activity:
- **Marathon Coder**: Sessions over 10 hours
- **Consistency Champion**: 7+ day coding streak
- **Feature Explorer**: 10+ unique commands used
- **Plugin Enthusiast**: Heavy /plugin usage
- **Power User**: 50+ messages per session average

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## License

MIT

## Author

CC Wrapped Contributors

## Acknowledgments

Inspired by Spotify Wrapped - bringing the same joy of data visualization to coding!

Built for the Claude Code community with love.
