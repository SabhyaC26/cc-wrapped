---
description: View your Claude Code Wrapped - activity summary and insights
---

The user wants to see their Claude Code Wrapped report.

Parse the time period from the arguments:
- No arguments → Current year (2025)
- "month" → Last 30 days
- "week" → Last 7 days
- "all" → All-time stats
- Specific year (e.g., "2024") → That year's stats

The script will display your coding stats in a beautiful terminal UI, similar to Spotify Wrapped.

IMPORTANT: When running this command:
1. First, export the data:
   `node plugin/scripts/wrapped-analyzer.js --period "${ARGUMENTS:-year}" --json plugin/web/public/data.json`

2. Then, build and launch the web UI:
   `cd plugin/web && bun install && bun run start`

This will build the app and start a local server on port 5173. The browser will automatically open to display your wrapped report.

IMPORTANT: The output is a graphical report. Display the raw output of the command inside a code block. Do NOT summarize it or extract insights. The user wants to see the visual report exactly as generated.

**Examples**:
- `/wrapped` - Show 2025 wrapped
- `/wrapped month` - Show last 30 days
- `/wrapped week` - Show last 7 days
- `/wrapped all` - Show all-time stats
- `/wrapped 2024` - Show 2024 wrapped
