# ᑕOᑎᑎEᑕT 🪢

A React chat client for private conversations: login, contacts, threads, settings, blocks, reports, and in-thread search.

The UI talks to `/api/*` routes. In this checkout those routes are served by an in-browser mock so the app runs without a backend, external services, or credentials.

## Demo accounts

| Username | Password   |
| -------- | ---------- |
| alice    | password12 |
| bob      | password12 |
| ria      | password12 |

Alice already has Bob as a contact.

## Requirements

- Node.js 20
- npm (one lockfile at the repository root)

## Setup

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | What it does                          |
| -------------- | ------------------------------------- |
| `npm run dev`  | Vite dev server on port 3000          |
| `npm test`     | Vitest (jsdom, no network)            |
| `npm run lint` | ESLint                                |
| `npm run build`| Production build                      |

## Project layout

```
src/
  api/           HTTP helpers for chat features
  components/    Sidebar, messages, shared UI
  context/       Auth and socket providers
  features/      Settings, blocks, reports, search
  hooks/         Login, signup, conversations, messages
  mocks/         MSW handlers and in-memory data
  pages/         Login, signup, home
  test/          Test setup and render helpers
```

## Tests

Tests use Vitest, Testing Library, and MSW. They do not need MongoDB, a live socket server, or `.env` secrets.

## License

MIT. See [LICENSE](LICENSE).

## Contact

- Email: [Muntajirwork11@gmail.com](mailto:Muntajirwork11@gmail.com)
- GitHub: [Muntajir11](https://github.com/Muntajir11)
