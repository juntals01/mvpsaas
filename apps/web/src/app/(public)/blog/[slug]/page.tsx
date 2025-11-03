import { posts } from '@/constants/posts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';

type Params = { slug: string };

type Post = {
  slug: string;
  title: string;
  description?: string;
  cover?: string;
  date: string | number | Date;
  tags?: string[];
  body: string;
};

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (posts as Post[]).find((p) => p.slug === slug);
  if (!post) return {};

  const title = `${post.title} • MVP Base Blog`;
  const description = post.description ?? '';
  const images = post.cover ? [post.cover] : [];

  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
    alternates: { canonical: `/blog/${slug}` },
  };
}

/** Minimal markdown-ish renderer: supports "## " headings, "- " lists, and paragraphs */
function renderBody(md: string) {
  const raw = (md ?? '').trim().split('\n');
  const lines = raw.filter((l) => l !== '');
  const nodes: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={key++} className='mt-6 text-xl font-semibold'>
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={key++} className='mt-3 list-disc pl-5 space-y-1 text-gray-700'>
          {items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      );
      continue;
    }

    nodes.push(
      <p key={key++} className='mt-3 text-gray-700'>
        {line}
      </p>
    );
    i++;
  }

  return nodes;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post = (posts as Post[]).find((p) => p.slug === slug);
  if (!post) notFound();

  const dateStr = (() => {
    try {
      const dateValue: Post['date'] | undefined = post.date;
      let dt: Date | null = null;

      if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        dt = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        dt = dateValue;
      }

      if (!dt || Number.isNaN(dt.getTime())) return '';

      return dt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return '';
    }
  })();

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <main className='min-h-screen bg-white text-gray-900'>
      <section className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16 pb-6'>
        <Link
          href='/blog'
          aria-label='Back to blog'
          className='text-sm text-gray-500 hover:text-gray-700'
        >
          ← Back to blog
        </Link>

        <h1 className='mt-4 text-3xl sm:text-4xl font-semibold tracking-tight'>
          {post.title}
        </h1>

        {dateStr && <div className='mt-2 text-sm text-gray-500'>{dateStr}</div>}

        {tags.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {tags.map((t) => (
              <span
                key={t}
                className='rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700'
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-24'>
        <article className='prose prose-gray max-w-none'>
          {renderBody(post.body ?? '')}
        </article>
      </section>
    </main>
  );
}
