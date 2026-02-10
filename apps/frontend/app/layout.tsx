import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css'
import React from 'react';
import { Nav } from './components/nav';
import { ToastProvider } from '@/components/notification/toast';
import { QueryProvider } from '@/provider/query-provider';
import { MobileNavWrapper } from '@/components/navigation/mobile-nav-wrapper';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';

  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <QueryProvider>
          <ToastProvider>
            <Nav />
            {children}
            <MobileNavWrapper />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

