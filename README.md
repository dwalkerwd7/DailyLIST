# DailyLIST

A minimalist daily todo list app that resets every 24 hours. Built with simplicity and usability in mind — no unnecessary features, just a clean way to track your daily tasks.

You can view this app in all its glory at `derekwalker.xyz/dailylist`

## Features

- **Daily Reset** — Your list automatically resets every 24 hours, encouraging a fresh start each day
- **Simple Todo Management** — Create, check off, and delete todos with minimal friction
- **Optional Notes** — Add brief notes to any todo for extra context
- **Clean UI** — Focused design with light and dark theme support

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
In the near future, I will modernize my portfolio server by transitioning to a microservices architecture which will make DailyLIST a more accessible project to use out of the box.

## Contributing

Feel free to fork and submit pull requests. This is a basic project, so it's a great opportunity to contribute to open source software!
