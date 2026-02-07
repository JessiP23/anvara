import type { Metadata } from 'next';
import './globals.css'
import React from 'react';
import { Nav } from './components/nav';
import { ToastProvider } from '@/components/notification/toast';
import { QueryProvider } from '@/provider/query-provider';

// TODO: Add ErrorBoundary wrapper for graceful error handling
// TODO: Consider adding a loading.tsx for Suspense boundaries
// TODO: Add Open Graph metadata for social media sharing
// TODO: Add Twitter Card metadata
// TODO: Consider adding favicon and app icons

const siteConfig = {
  name: 'Anvara',
  description: 'Sponsorship marketplace connecting sponsors with publishers',
  url: globalThis.process?.env?.NEXT_PUBLIC_SITE_URL || 'https://www.anvara.com/'
}

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Sponsorship Marketplace`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["sponsorship", 'advertising', 'marketplace', 'publishers', 'sponsors', 'ad slots', 'campaigns'],
  authors: [{ name: 'Anvara Team' }],
  creator: 'Anvara',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Sponsorship Marketplace`,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Connect sponsors with publishers`,
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Sponsorship Marketplace`,
    description: siteConfig.description,
    images: ['/og-image.png'],
    creator: '@anvara',
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
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // HINT: If using React Query, you would wrap children with QueryClientProvider here
  // See: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <QueryProvider>
          <ToastProvider>
            <Nav />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

