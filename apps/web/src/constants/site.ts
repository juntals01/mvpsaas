export const SITE = {
  name: 'MVP Base',
  description:
    'Launch your SaaS faster with MVP Base — a modern Next.js + Clerk starter with auth, billing, and Docker infra.',
  logo: '/mvpbase-logo-text.png',
  faviconPath: '/favicon', // 👈 base folder path
  url: 'https://mvpbase.com',
};

export const NAV_LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Documentation', href: '/docs' },
];

export const META = {
  defaultTitle: SITE.name,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [
      {
        url: `${SITE.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
