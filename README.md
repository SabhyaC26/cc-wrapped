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

```bash
# Clone the repository
git clone https://github.com/SabhyaC26/cc-wrapped.git
cd cc-wrapped

# Install dependencies
npm install

# Add to Claude Code plugins
claude plugin marketplace add $(pwd)
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

## Data Sources

Claude Code Wrapped analyzes data from:

- `~/.claude/stats-cache.json` - Activity metrics, model usage, hour distribution
- `~/.claude/history.jsonl` - Command history and project activity

No background tracking required - all analysis is done on-demand!

## Requirements

- Node.js 14+
- Claude Code CLI
- Active Claude Code usage (to have data to analyze)

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

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## License

MIT
