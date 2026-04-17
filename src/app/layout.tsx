import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'allrecords',
  description: 'allrecords',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
          <a href="/support" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Support
          </a>
          <span className="mx-2">·</span>
          <a href="/privacy-policy" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Privacy Policy
          </a>
        </footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
