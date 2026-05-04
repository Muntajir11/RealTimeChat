# Deployment

## Environment

Set the same variables as in [`.env.example`](../.env.example). In production:

- Use a strong `JWT_SECRET`.
- Set `NODE_ENV=production` so cookies use `secure: true` (HTTPS only).
- Point `MONGO_URI` at your managed MongoDB cluster.
- Optionally set `CORS_ORIGINS` to a comma-separated list if the web UI is on another origin.

## Build

From `RealTimeChat`:

```bash
npm run build
```

This installs dependencies, builds the Vite app into `Frontend/dist`, and leaves the tree ready for `node Backend/server.js`.

## Docker

From the `realtime-chat` directory (parent of `RealTimeChat`), build the image that uses this layout:

```bash
docker build -t realtime-chat .
```

Run with MongoDB URI injected (example):

```bash
docker run -e MONGO_URI="mongodb://host.docker.internal:27017/realtime-chat" -e JWT_SECRET="your-secret" -p 5000:5000 realtime-chat
```

The container listens on port 5000 and serves the API, Socket.IO, and static frontend.
