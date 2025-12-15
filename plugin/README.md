# 🎉 Claude Code Wrapped

A beautiful CLI plugin for Claude Code that shows your coding stats and achievements, similar to Spotify Wrapped!

## Features

### 📊 Rich Analytics

- **Activity Metrics**: Total messages, sessions, tool calls, and active days
- **Calendar Heatmap**: Visual activity calendar showing your coding patterns
- **Peak Hours Analysis**: Discover when you code most effectively
- **Coding Persona**: Get a personalized coding style (Morning Architect, Night Owl, etc.)
- **Model Usage**: See your AI companion usage and token statistics
- **Cache Efficiency**: Track how efficiently you're using prompt caching
- **Tool Breakdown**: See which Claude Code tools you use most
- **Top Commands**: Your most-used slash commands
- **Project Analytics**: Most active projects
- **Achievements**: Unlock special badges based on your activity

### 🎨 Beautiful Visualizations

- ASCII bar charts and progress bars
- Calendar heatmap showing activity over time
- Color-coded intensity levels
- Boxed cards with organized information
- Clean, readable terminal UI

## Installation

This plugin is already installed in your Claude Code setup at `.claude/plugins/cc-wrapped`.

## Usage

```bash
# Show your 2025 wrapped
/wrapped

# Show last 30 days
/wrapped month

# Show last 7 days
/wrapped week

# Show all-time stats
/wrapped all

# Show specific year
/wrapped 2024
```

## What's Tracked

### Activity Metrics
- Total messages sent
- Number of coding sessions
- Tool calls made
- Days active
- Longest coding streak
- Most active day
- Average messages per session
- Longest session duration

### Time Analytics
- Peak coding hours (top 3)
- Hourly session distribution
- Busiest day of the week
- Coding persona based on time patterns

### AI Usage
- Models used (Opus, Sonnet, Haiku)
- Token consumption per model
- Percentage breakdown
- Cache hit rate and efficiency
- Total tokens processed

### Commands & Tools
- Top 5 most-used commands
- Command diversity (unique commands)
- Most active project
- Tool usage breakdown (when available)

### Achievements

Unlock special achievements based on your activity:

- 🏆 **Marathon Coder**: Sessions over 10 hours
- 🏆 **Consistency Champion**: 7+ day coding streaks
- 🏆 **Feature Explorer**: 10+ unique commands used
- 🏆 **Plugin Enthusiast**: Heavy plugin user
- 🏆 **Power User**: High messages per session average

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
├── lib/
│   ├── chart-generator.js  # ASCII chart utilities
│   └── date-utils.js       # Date parsing helpers
└── .claude-plugin/
    └── plugin.json         # Plugin metadata
```

## Recent Improvements

### v2.0 Enhancements

✨ **New Features**:
- Tool usage breakdown visualization (shows when available)
- Improved chart visualizations
- Enhanced achievement system

🎨 **Visual Improvements**:
- Better color coding and formatting
- Enhanced calendar heatmap with 4-week view
- Cleaner progress bars
- Improved model usage display with percentage bars
- More consistent card styling

## Data Source

The plugin reads from Claude Code's built-in stats cache:
- `~/.claude/stats-cache.json` - Aggregated statistics
- `~/.claude/history.jsonl` - Session history

## Privacy

All data stays local on your machine. The plugin only reads existing Claude Code statistics and doesn't send any data externally.

## Troubleshooting

### "Stats file not found"

Make sure you've used Claude Code before running `/wrapped`. Stats are only generated after your first coding session.

### No tool usage data

Tool usage breakdown requires detailed stats that may not be available in all versions of Claude Code. The card will be hidden if no data is available.

## Contributing

Found a bug or have a feature request? The plugin code is modular and easy to extend:

1. **Add new metrics**: Update `metrics-calculator.js`
2. **Add new visualizations**: Update `chart-generator.js`
3. **Add new cards**: Update `ui-renderer.js`
4. **Add new achievements**: Update `generateInsights()` in `metrics-calculator.js`

## License

Part of the Claude Code ecosystem.

---

Made with ❤️ for Claude Code users

Enjoy your Wrapped! 🚀
