# CLAUDE.md

## Architecture

Next.js 15 app with custom server (`server.ts`) for Socket.IO. Socket handlers in `src/server/socket-handler.ts`.

**Real-time flow:** `SocketProvider` → `useChannel` (linkshared/linkchanged) → `useYouTubeSync` (playvideo/pausevideo) → server broadcasts & persists to MongoDB.

**Database:** MongoDB via Prisma. `npx prisma db push` to sync schema.

## Commits

Use [Conventional Commits](https://conventionalcommits.org): `type(scope): description`

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`

Examples:
- `feat(channel): add video sync indicator`
- `fix(socket): resolve reconnection issue`
- `refactor(hooks): simplify useChannel logic`
