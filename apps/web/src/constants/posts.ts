export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  tags: string[];
  cover?: string;
  body: string; // simple markdown-ish string for now
};

export const posts: Post[] = [
  {
    slug: 'shipping-v1',
    title: 'Shipping v1 of MVP Base',
    description:
      'How we structured a Turborepo with Next.js, NestJS, Clerk, and Docker—ready for SaaS.',
    date: '2025-11-01',
    tags: ['mvp', 'nextjs', 'nestjs', 'clerk'],
    cover: '/og/mvpbase.png',
    body: `
## What we shipped
- Turborepo with apps/api + apps/web
- Clerk auth, PricingTable billing
- Docker infra: Postgres, Redis, MinIO
`,
  },
  {
    slug: 'queues-media-hls',
    title: 'Media Pipelines with BullMQ + HLS',
    description:
      'A minimal queue/worker layout for transcoding and storing secure HLS variants.',
    date: '2025-10-28',
    tags: ['bullmq', 'video', 'hls', 'minio'],
    body: `
## Highlights
- BullMQ queues/workers
- FFmpeg HLS renditions
- URLs stored per variant
`,
  },
  {
    slug: 'typeform-to-rjsf',
    title: 'From Typeform Flows to RJSF',
    description:
      'Converting complex multi-step forms to JSON Schema with RJSF, Zod, and great DX.',
    date: '2025-10-15',
    tags: ['forms', 'rjsf', 'zod'],
    body: `
## TL;DR
Schema-first forms scale better and are easier to validate and ship.
`,
  },
];
