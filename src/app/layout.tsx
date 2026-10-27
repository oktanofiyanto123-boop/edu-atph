import type { Metadata } from 'next';
import './globals.css';

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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
