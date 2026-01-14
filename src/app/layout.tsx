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
  metadataBase: new URL('https://rovernote.live'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rovernote.live',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
