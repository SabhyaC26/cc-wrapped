# Claude Code Wrapped Plugin

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
claude plugin marketplace add SabhyaC26/cc-wrapped
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

## File Structure

```
plugin/
├── commands/
│   └── wrapped.md          # Slash command definition
├── scripts/
│   ├── wrapped-analyzer.js # Main entry point
│   ├── data-parser.js      # Stats data loading
│   ├── metrics-calculator.js # Metrics computation
│   └── ui-renderer.js      # Terminal UI rendering
└── lib/
    ├── chart-generator.js  # ASCII chart utilities
    └── date-utils.js       # Date parsing helpers
```

## Development

See the main repository README for development instructions.

## License

MIT
