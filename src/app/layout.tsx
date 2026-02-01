import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { MobileBottomSpacer } from '@/components/MobileBottomSpacer';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: 'RoverNote - Your Travel Scrapbook',
    template: '%s | RoverNote',
  },
  description: 'Create beautiful scrapbook-style travel journals, share your adventures, and get inspired by travelers from around the world.',
  keywords: ['travel', 'scrapbook', 'journal', 'travel diary', 'adventure', 'travel blog', 'memories', 'photo journal'],
  authors: [{ name: 'RoverNote Team' }],
  creator: 'RoverNote',
  publisher: 'RoverNote',
  metadataBase: new URL('https://www.rovernote.live'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rovernote.live',
    siteName: 'RoverNote',
    title: 'RoverNote - Your Travel Scrapbook',
    description: 'Create beautiful scrapbook-style travel journals, share your adventures, and get inspired by travelers from around the world.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'RoverNote - Travel Scrapbook',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoverNote - Your Travel Scrapbook',
    description: 'Create beautiful scrapbook-style travel journals, share your adventures, and get inspired by travelers from around the world.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'D3DF0GGWxogw3G8cuqRFw31T_RAMi2gSLFmNsefMeVg',
  },
};

// Structured data for Google (helps with sitelinks)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.rovernote.live/#website',
      'url': 'https://www.rovernote.live',
      'name': 'RoverNote',
      'description': 'Create beautiful scrapbook-style travel journals',
      'publisher': {
        '@id': 'https://www.rovernote.live/#organization'
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.rovernote.live/#organization',
      'name': 'RoverNote',
      'url': 'https://www.rovernote.live',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.rovernote.live/logo.png',
      },
      'sameAs': []
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.rovernote.live/#webpage',
      'url': 'https://www.rovernote.live',
      'name': 'RoverNote - Your Travel Scrapbook',
      'isPartOf': {
        '@id': 'https://www.rovernote.live/#website'
      },
      'about': {
        '@id': 'https://www.rovernote.live/#organization'
      },
      'description': 'Create beautiful scrapbook-style travel journals, share your adventures, and get inspired by travelers from around the world.'
    },
    {
      '@type': 'SiteNavigationElement',
      'name': 'Community',
      'url': 'https://www.rovernote.live/community'
    },
    {
      '@type': 'SiteNavigationElement',
      'name': 'Map',
      'url': 'https://www.rovernote.live/map'
    },
    {
      '@type': 'SiteNavigationElement',
      'name': 'My Scrapbook',
      'url': 'https://www.rovernote.live/my-scrapbook'
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
            <SpeedInsights />
            <Analytics />
          </main>
          <Footer />
          <MobileBottomSpacer />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
