# Architecture

The app is a single deployment that serves a static React build from Express and exposes a JSON API plus a Socket.IO server on the same HTTP port.

## Request flow

- **Authentication**: JWT is issued on signup or login and stored in an `httpOnly` cookie. Protected REST routes read the cookie and attach `req.user`.
- **REST**: Routes live under `/api/auth`, `/api/users`, `/api/messages`, and `/api/conversations`. Controllers are thin; validation uses Zod; domain logic sits in `Backend/services/`.
- **Realtime**: Socket.IO shares the Express HTTP server. On connect, the client passes `userId` in the handshake query. The server tracks `userId` to socket id and broadcasts the list of online user ids as `getOnlineUsers`. New chat messages are pushed to the recipient with `newMessage` when they are online.

## Data

- **MongoDB** via Mongoose: users (with embedded contact refs), optional legacy `Contact` documents for message-driven contact sync, conversations, and messages.
- **Frontend** uses React, React Router, Zustand for the selected conversation, and context for auth and the socket client.

## Error handling

`asyncHandler` forwards async errors to Express. `HttpError` maps to HTTP status codes; other errors return 500 in production.
