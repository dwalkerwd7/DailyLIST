# DailyLIST

A minimalist daily todo list app that resets every 24 hours. Built with simplicity and usability in mind — no unnecessary features, just a clean way to track your daily tasks.

## Features

- **Daily Reset** — Your list automatically resets every 24 hours, encouraging a fresh start each day
- **Simple Todo Management** — Create, check off, and delete todos with minimal friction
- **Optional Notes** — Add brief notes to any todo for extra context
- **Clean UI** — Focused design with light and dark theme support

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Express v5 + TypeScript
- **Environment:** Node.js v24.14.0, npm v11.9.0
- **Environment Management:** varlock

## Getting Started

### Prerequisites

- Node.js v24.14.0+
- npm v11.9.0+

### Installation

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Development

In separate terminals:

```bash
# Terminal 1 - Start the dev server
cd server
npm run dev
# Runs on http://localhost:3001

# Terminal 2 - Start the dev client
cd client
npm run dev
# Runs on http://localhost:5173
```

The Vite dev server automatically proxies `/api/*` requests to the backend, so no CORS configuration needed.

### Environment Variables

Variables are managed via `varlock`. Check `server/.env.schema.example` for defaults:

To validate env setup:

1. rename .env.schema.example --> .env.schema

2. ```bash
cd server
npx varlock load
```

## Status

**Version:** 0.4 (Active Development)

Currently building towards v1.0 with core todo functionality. See issues and pull requests for planned features and work in progress.

## Contributing

This is a personal portfolio project, but if you'd like to contribute, feel free to fork and submit pull requests.

## License

MIT License — see LICENSE file for details.
