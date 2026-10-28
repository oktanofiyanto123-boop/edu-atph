import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/app/providers';
import PWAInstallPrompt from '@/components/pwa/InstallPrompt';

export const metadata: Metadata = {
  title: 'EduATPH — Platform Pembelajaran Digital Agribisnis Tanaman',
  description:
    'Belajar pertanian modern secara digital. Pelajari materi, ikuti evaluasi, kerjakan tugas, dan pantau perkembangan belajarmu dalam satu platform. Administrator: Okta Nofiyanto.',
  keywords: [
    'ATPH',
    'SMK Pertanian',
    'EduATPH',
    'Agribisnis Tanaman Pangan dan Hortikultura',
    'Hidroponik',
    'Okta Nofiyanto',
    'LMS Pertanian',
  ],
  authors: [{ name: 'Okta Nofiyanto' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EduATPH',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon-192.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#059669',
    'msapplication-TileImage': '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#059669' },
    { media: '(prefers-color-scheme: light)', color: '#059669' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
