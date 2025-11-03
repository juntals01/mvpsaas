import { posts } from '@/constants/posts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Post = {
  slug: string;
  title: string;
  description?: string;
  date: string | number | Date;
  tags?: string[];
};

function formatDate(d: Post['date']) {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(dt);
  } catch {
    return '';
  }
}

export default async function BlogIndexPage() {
  const list = [...(posts as Post[])].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );

  return (
    <main className='min-h-screen bg-white text-gray-900'>
      {/* Header */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-10'>
        <h1 className='text-3xl sm:text-4xl font-semibold tracking-tight'>
          Blog
        </h1>
        <p className='mt-3 text-sm sm:text-base text-gray-600'>
          Notes on building MVPs, infra, and product loops.
        </p>
      </section>

      {/* Grid */}
      <section className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24'>
        {list.length === 0 ? (
          <div className='rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-600'>
            No posts yet. Check back soon!
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {list.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                aria-label={`Read ${p.title}`}
                className='group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300'
              >
                <div className='flex items-center justify-between gap-4'>
                  <h2 className='text-lg font-medium leading-snug'>
                    {p.title}
                  </h2>
                  <span className='shrink-0 text-xs text-gray-500'>
                    {formatDate(p.date)}
                  </span>
                </div>

                {p.description ? (
                  <p className='mt-2 text-sm text-gray-600 line-clamp-3'>
                    {p.description}
                  </p>
                ) : null}

                {!!p.tags?.length && (
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {p.tags!.map((t) => (
                      <span
                        key={t}
                        className='rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700'
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className='mt-5 inline-flex items-center gap-1 text-sm text-gray-700'>
                  Read more
                  <span className='transition-transform group-hover:translate-x-0.5 opacity-60'>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
