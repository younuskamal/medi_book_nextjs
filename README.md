# Medi Book

A simple clinic management demo built with Next.js, Prisma and NextAuth. It supports three user roles: **Admin**, **Doctor** and **Patient**. Users can log in, view their appointments and doctors can update appointment statuses.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Set up your environment variables in `.env` with a `DATABASE_URL` pointing to a PostgreSQL database.
3. Run database migrations and seed demo data
   ```bash
   npx prisma migrate dev
   npm run seed
   ```
   This creates three demo accounts:
   | Role | Email | Password |
   |------|---------------------|-------------|
   | Admin | admin@demo.io | Admin123! |
   | Doctor | dr.house@demo.io | Doctor123! |
   | Patient | patient@demo.io | Patient123! |
4. Start the development server
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000` – unauthenticated users are redirected to the login page. After logging in you'll land on the dashboard relevant to your role.

## Scripts
- `npm run lint` – lint the codebase
- `npm run typecheck` – run TypeScript checks

## License
MIT
