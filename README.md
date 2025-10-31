# MVP Base — Stable Release

A full-stack **Turborepo** combining **Next.js**, **NestJS**, **Tailwind CSS v4**, **shadcn/ui**, and **Firebase** for modern web app development.  
This version is marked as the **latest stable release**.

---

## 🚀 Tech Stack

**Frontend**

- Next.js 14 (App Router)
- Tailwind CSS v4
- shadcn/ui + Radix UI
- TypeScript

**Backend**

- NestJS (GraphQL-ready)
- TypeORM or Prisma (flexible)
- Redis / PostgreSQL (optional)
- Firebase Emulator (Auth & Firestore)

**Tooling**

- Turborepo (monorepo manager)
- ESLint + Prettier (shared configs)
- Sonner + Lucide Icons
- Docker-ready for local dev

---

## 📁 Project Structure

mvpbase/
│
├── apps/
│ ├── api/ # NestJS backend
│ └── web/ # Next.js frontend (Tailwind v4 + shadcn/ui)
│
├── common/ # Shared configs (eslint, tsconfig, graphql)
├── package.json
├── turbo.json
├── .env
└── README.md

> Root `.env` is shared between both apps.  
> Workspaces are defined in package.json as `"workspaces": ["apps/*"]`.

---

## ⚙️ Setup & Commands

### Install Dependencies

npm install

### Run Both Apps

npm run dev

### Run Only One App

# API (NestJS)

npm run dev -w apps/api

# Web (Next.js)

npm run dev -w apps/web

### Clean Turbo Cache

npx turbo clean

### Add Packages

# API only

npm install -w apps/api <package-name>

npm run -w apps/api seed:admin -- --email=admin@example.com --name="Admin User"

# Web only

npm install -w apps/web <package-name>

---

## 🔥 Firebase (Emulator Ready)

The repo supports local Firebase auth and Firestore emulators via Docker:

services:
firebase:
image: andreysenov/firebase-tools
container_name: mvpbase-firebase
restart: no
ports: - "4000:4000" # Emulator UI - "9099:9099" # Auth Emulator

Access at:  
👉 http://localhost:4000

Keep your config file:
firebase/firebase.json

---

## 🌈 UI Stack (shadcn)

Installed via:
npx shadcn@latest init

Common components:

- @/components/ui/button
- @/components/ui/card
- @/components/ui/sonner (toast)
- @/components/ui/avatar
- @/components/ui/input

---

## 🧩 Stable Release Workflow

1. Commit your changes  
   git add .
   git commit -m "chore: prepare stable release"

2. Tag the stable version  
   git tag -a v1.0.0 -m "Stable Release v1.0.0"
   git push origin v1.0.0

3. Create a GitHub Release
   - Go to **GitHub → Releases → Draft a new release**
   - Tag: `v1.0.0`
   - Title: `Stable Release v1.0.0`
   - Description: Add changelog or features
   - Click **Publish Release**

Now your latest commit is publicly marked as **Stable** — like other software releases.

---

## 🧠 Author

**Norberto Libago**  
Full-stack Developer — Next.js | NestJS | Firebase | Tailwind  
🌐 https://www.linkedin.com/in/norberto-libago-66641b99/  
💻 https://github.com/juntals01
