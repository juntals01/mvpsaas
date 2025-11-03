import { Toaster } from '@/components/ui/sonner';
import { META, SITE } from '@/constants/site';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: META.defaultTitle,
  description: META.description,
  openGraph: META.openGraph,
  icons: {
    icon: [
      {
        url: `${SITE.faviconPath}/favicon-16x16.png`,
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: `${SITE.faviconPath}/favicon-32x32.png`,
        sizes: '32x32',
        type: 'image/png',
      },
      { url: `${SITE.faviconPath}/favicon.ico`, type: 'image/x-icon' },
    ],
    apple: {
      url: `${SITE.faviconPath}/apple-touch-icon.png`,
      sizes: '180x180',
      type: 'image/png',
    },
    other: [
      {
        rel: 'manifest',
        url: `${SITE.faviconPath}/site.webmanifest`,
      },
      {
        rel: 'android-chrome',
        url: `${SITE.faviconPath}/android-chrome-192x192.png`,
      },
      {
        rel: 'android-chrome',
        url: `${SITE.faviconPath}/android-chrome-512x512.png`,
      },
    ],
  },
};

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang='en' className={montserrat.variable} suppressHydrationWarning>
        <body className='font-sans antialiased'>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
