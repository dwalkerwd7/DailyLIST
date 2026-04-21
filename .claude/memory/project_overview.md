---
name: DailyLIST Project Overview
description: What DailyLIST is, its tech stack, architecture, and deployment setup
type: project
originSessionId: de6bb3e8-8575-4b3f-991c-7f3a1bd656df
---
DailyLIST is a minimalist daily todo list web app with automatic 24-hour resets. Users create, check off, delete, and reorder todos; the full list clears after 24 hours to encourage a fresh start each day.

**Why:** Clean, focused productivity tool — no accounts, no database, no complexity.

**How to apply:** Keep suggestions minimal and in line with the app's ethos of simplicity. Avoid adding features like user accounts, persistence beyond 24h, or complex state management.

## Tech Stack

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4, React Router v7, dnd-kit (drag-and-drop), Lucide React icons
- **Backend:** Express v5 + TypeScript, Node.js
- **Database:** None — state persisted via HTTP-only cookies (24h maxAge)
- **Env vars:** dotenv (recently migrated away from Varlock)

## Key Architecture Decisions

- **Cookie-based persistence**: Todos stored in HTTP-only secure cookies, 24h expiry. No DB, no user accounts.
- **24-hour reset**: Timer starts when first todo added. Server validates expiry on every request and clears expired cookies.
- **Subpath deployment**: Served at `derekwalker.tech/dailylist`. `BASE_PATH=/dailylist` injected at Vite build time. API calls use `${BASE_URL}/api/...`.
- **No Docker**: Production build is `npm run build` + `npm start` (compiles client to `server/public/`).
- **Feedback logging**: IP-based spam prevention, stored in plain text files at `LOG_DIR`.

## Key Files

- `server/src/server.ts` — Single Express file with all routes (GET/POST `/api/todos`, `/api/feedback`, `/api/render`)
- `client/src/components/TodoApp.tsx` — Core state, timer logic, API syncing (~380 lines)
- `client/src/components/TodoItem.tsx` — Individual todo row with drag handle, notes, delete
- `client/src/App.css` — Theme system (CSS variables, light/dark), animations
- `client/vite.config.ts` — Builds to `server/public/`, configures BASE_PATH
- `client/src/app-constants.ts` — Centralized API paths

## Constraints

- Max 20 todos per list
- Todo title max 50 chars, notes max 500 chars
- One feedback submission per IP
