import type { Metadata } from "next";
import "./globals.css";
import {Inter} from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VinylScratch — Your music, organized',
  description:
    'Upload songs, build playlists, and keep your favorites in one clean, fast music library.',
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
   <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
   </html>
  );
}