export default function DocsPage() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-white to-slate-50 py-16 px-6'>
      <div className='mx-auto max-w-3xl space-y-10'>
        <header className='text-center'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            MVP Base Documentation
          </h1>
          <p className='mt-3 text-sm text-muted-foreground'>
            A production-ready Next.js + NestJS monorepo with Docker, Clerk, and
            TypeORM.
          </p>
        </header>

        <section>
          <h2 className='text-xl font-semibold mb-2'>🚀 Getting Started</h2>
          <p className='text-sm text-muted-foreground mb-3'>
            Clone the repository and install dependencies:
          </p>
          <pre className='rounded-lg bg-slate-950 p-4 text-[13px] text-slate-50'>
            <code>
              {`git clone https://github.com/juntals01/mvpbase
cd mvpbase
npm install
npm run docker:up
npm run dev`}
            </code>
          </pre>
          <p className='text-sm text-muted-foreground'>
            This runs both the frontend (Next.js) and backend (NestJS) in
            parallel.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>📁 Project Structure</h2>
          <pre className='rounded-lg bg-slate-950 p-4 text-[13px] text-slate-50'>
            <code>
              {`mvpbase/
├── apps/
│   ├── web/    # Next.js frontend
│   └── api/    # NestJS backend
├── docker-compose.yml
├── .env
└── package.json`}
            </code>
          </pre>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>
            ⚙️ Environment Variables
          </h2>
          <p className='text-sm text-muted-foreground mb-3'>
            Configure your local `.env` in the project root:
          </p>
          <pre className='rounded-lg bg-slate-950 p-4 text-[13px] text-slate-50'>
            <code>
              {`# App
API_PORT=4000
WEB_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Database
POSTGRES_USER=mvpbase_user
POSTGRES_PASSWORD=mvpbase_pass
POSTGRES_DB=mvpbase_db
POSTGRES_PORT=5433

# Redis
REDIS_PORT=6379`}
            </code>
          </pre>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>🧱 Common Commands</h2>
          <pre className='rounded-lg bg-slate-950 p-4 text-[13px] text-slate-50'>
            <code>
              {`# Run both web + api
npm run dev

# Run only API
npm run dev -w apps/api

# Run only Web
npm run dev -w apps/web

# Start Docker services (Postgres, Redis, MinIO)
npm run docker:up

# Stop Docker
npm run docker:down`}
            </code>
          </pre>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>
            🔐 Authentication (Clerk)
          </h2>
          <p className='text-sm text-muted-foreground mb-3'>
            MVP Base uses Clerk for authentication on both the frontend and
            backend.
          </p>
          <pre className='rounded-lg bg-slate-950 p-4 text-[13px] text-slate-50'>
            <code>
              {`# Web
npm install -w apps/web @clerk/nextjs

# API
npm install -w apps/api @clerk/clerk-sdk-node @clerk/express`}
            </code>
          </pre>
          <p className='text-sm text-muted-foreground'>
            Clerk handles login, sign-up, and JWT verification for the API.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>
            🗄️ Database & Migrations
          </h2>
          <pre className='rounded-lg bg-slate-950 p-4 text-[13px] text-slate-50'>
            <code>
              {`# Generate a migration
npm run -w apps/api migration:generate src/database/migrations/AddUserTable

# Run migrations
npm run -w apps/api migration:run

# Reset DB
npm run -w apps/api db:reset`}
            </code>
          </pre>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>💡 Development Tips</h2>
          <ul className='list-disc pl-5 text-sm text-muted-foreground space-y-2'>
            <li>
              Restart Docker with <code>npm run docker:restart</code> if DB
              changes.
            </li>
            <li>Environment variables in root `.env` apply to both apps.</li>
            <li>
              Frontend runs on <code>http://localhost:3000</code>.
            </li>
            <li>
              API runs on <code>http://localhost:4000</code>.
            </li>
          </ul>
        </section>

        <footer className='border-t pt-8 text-center text-xs text-muted-foreground'>
          © {new Date().getFullYear()} MVP Base — Built with Next.js, NestJS,
          and Clerk.
        </footer>
      </div>
    </main>
  );
}
