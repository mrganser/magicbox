# Magic Box

A real-time media sharing platform. Create channels, share links, and watch YouTube videos together with synchronized playback.

## Demo

https://themagicbox.onrender.com/

## Features

- **Real-time Sharing** - Share links instantly with everyone in your channel
- **YouTube Sync** - Watch YouTube videos together with synchronized play/pause
- **Public & Private Channels** - Create public channels or private ones shared only via link
- **Multiple Media Types** - Support for YouTube, Spotify embeds, images, PDFs, and more

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Real-time**: [Socket.IO](https://socket.io/)
- **Spam Protection**: [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure the following in your `.env` file:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - reCAPTCHA site key (optional)
   - `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret key (optional)

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

## Running Tests

```bash
npm test
```

## Deployment

This project is ready to deploy to platforms like Render, Vercel, or Railway. Make sure to:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run `npx prisma db push` to initialize the database schema

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
