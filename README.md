# 🧱 MVP SaaS — Full-Stack Boilerplate for Modern SaaS Apps

A production-ready Turborepo boilerplate for building scalable SaaS platforms with Next.js, NestJS, Tailwind CSS v4, shadcn/ui, and Clerk authentication.  
Designed for local development with Docker — ideal for developers creating SaaS products using Next.js, NestJS, and PostgreSQL.

> ⚠️ **Important Note:**  
> Before running the app, make sure to **add your subscription plans in [Clerk Dashboard → Billing](https://dashboard.clerk.com/)**.  
> This ensures your pricing and plan management features work correctly during local and production development.

---

## 🚀 Tech Stack

### Frontend

- Next.js 15 (App Router)
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Clerk Auth (User Management)
- TypeScript

### Backend

- NestJS
- TypeORM + PostgreSQL
- Redis
- JWT verification via Clerk

### Tooling

- Turborepo (monorepo manager)
- ESLint + Prettier (shared configs)
- Sonner + Lucide Icons
- Docker Compose (Postgres, Redis, MinIO)
- Environment shared via root `.env`

---

## ⚙️ Installation & Setup

### Download the Repository

```bash
git clone https://github.com/juntals01/mvpbase.git
cd mvpbase

cp .env.example .env
```

#### Replace clerk keys

CLERK_PUBLISHABLE_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY should be the same

https://clerk.com/docs/getting-started/quickstart/pages-router

```bash
# ==============================
# ⚙️ Clerk
# ==============================

CLERK_SECRET_KEY=sk_test_

# Clerk (backend)
CLERK_PUBLISHABLE_KEY=pk_test_

# Clerk (frontend)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_
```

### Install Docker

If you don’t have Docker yet:

macOS: https://docs.docker.com/desktop/setup/install/mac-install/

Windows: https://docs.docker.com/desktop/setup/install/windows-install/

Linux: https://docs.docker.com/desktop/setup/install/linux/

### Start Infrastructure

The stack includes PostgreSQL, Redis, and MinIO.

```bash
npm run docker:up
```

### Check container status:

```bash
npm run docker:ps
```

### Tail logs:

```bash
npm run docker:logs
```

### Run Database Migrations

Make sure the API is built first:

```bash
npm run -w apps/api build
npm run -w apps/api migration:run
```

### Start the Apps

Run both the API and Web apps in parallel:

```bash
npm run dev
```
