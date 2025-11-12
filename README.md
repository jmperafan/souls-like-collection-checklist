# Souls-like Physical Collection Tracker

A simple, offline-first web app to track your souls-like game collection across all platforms.

## Quick Start

```bash
# Run with Docker
docker compose up -d

# Open in browser
http://localhost:8080
```

Or just open `index.html` directly in your browser - no server needed!

## Features

- **93+ Souls-like Games** - Comprehensive list from r/soulslikes
- **Click to Track** - Mark games as owned with a single click
- **Filter & Search** - By platform, release type, year, developer
- **Statistics Dashboard** - Track completion percentage
- **Export/Import** - Backup and restore your collection
- **100% Offline** - Works without internet after initial load
- **No Setup Required** - No API keys, no configuration

## How It Works

- All data stored in browser's LocalStorage
- Placeholder covers for all games
- Fully static - just HTML/CSS/JavaScript
- Works on GitHub Pages, any web server, or locally

## Tech Stack

- Vanilla JavaScript (no frameworks)
- CSS with Dark Souls theme
- Docker + nginx for deployment
- LocalStorage for persistence

## Development

```bash
# Just open the file
open index.html

# Or use Docker
docker compose up --build
```

## Deployment

### GitHub Pages
1. Push to GitHub
2. Enable Pages in Settings
3. Done!

### Any Web Server
Just serve the files - no build step needed.

## License

MIT
