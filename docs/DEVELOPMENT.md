# Development

## Prerequisites

- Node.js 20+
- MongoDB reachable from your machine

## Setup

1. Copy [`.env.example`](../.env.example) to `.env` in the project root (`RealTimeChat`) and set `MONGO_URI` and `JWT_SECRET`.
2. Optionally copy [`Frontend/.env.example`](../Frontend/.env.example) to `Frontend/.env` and set `VITE_SOCKET_URL` (defaults to `http://localhost:5000` in dev).
3. From `RealTimeChat`: `npm install` then `npm install --prefix Frontend`.

## Run

- API + Socket.IO + production static (after build): `npm run server` or `npm start` (with `Frontend/dist` present).
- Dev UI with Vite proxy: from `Frontend`, `npm run dev` (port 3000 proxies `/api` to the backend on 5000).

## Scripts

- `npm run seed` — creates demo users `alice` and `bob` (password `password123`) if missing.
- `npm run db:indexes` — ensures useful indexes on users, conversations, and messages.
- `npm test` — Vitest (backend integration + frontend unit/MSW tests).
