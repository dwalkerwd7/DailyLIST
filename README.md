# DailyLIST

A minimalist daily todo list app that resets every 24 hours. Built with simplicity and usability in mind — no accounts, no sync, no backlog. Just what matters today. It is an experiment in minimizing the usability gap with user-centered design.

You can view this app in all its glory at `derekwalker.tech/dailylist`

## Features

- **Daily Reset** — Your list automatically resets every 24 hours, encouraging a fresh start each day
- **Simple Todo Management** — Create, check off, and delete todos with minimal friction
- **Optional Notes** — Add brief notes to any todo for extra context
- **Drag-and-Drop Reordering** — Rearrange todos in any order you like
- **Progress Bar** — Visual indicator of how many todos you've completed
- **Achievements** — Milestone-based achievements with toast notifications and sound effects
- **Sound Effects** — Subtle audio feedback for todo actions
- **Clean UI** — Focused design with light and dark theme support
- **Cookie-based Persistence** — No accounts or database; state is stored in HTTPOnly cookies

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Express v5 + TypeScript
- **Environment:** Node.js v24.14.0
- **Environment Management:** varlock

## Getting Started

### Global Prerequisites

- Node.js v24.14.0+

### Installation

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd server
npm install
```

### Development

Full stack:
```bash
cd server && npm run dev
```

Frontend only:
```bash
cd client && npm run dev
```

### Prepare for Deployment
In `.env.schema`, you need to set NODE_ENV=production to correct pathing.
The pathing (`client/.env`, `server/.env.schema` BASE_PATH and `dailylist-server.ts` PUBLIC_PATH) are set for my personal portfolio server. You may need to change these to fit your needs.

### Environment Variables

Variables are managed by [Varlock](https://varlock.dev). The `package.json` scripts handle loading environment variables automatically — no need to call `npx varlock load` manually.

Varlock is indeed overkill right now, but it was implemented for possible future usage.

## Future Development
My portfolio has been modernized to a microservices architecture. Technically, this can be containerized and deployed on a server with docker compose.

## Contributing

Any and all constructive, and contributive PR's will most likely be accepted. Go ahead, make this app better!
