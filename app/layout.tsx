import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'VenturEd Executive Dashboard',
  description: 'Executive dashboard for VenturEd Solutions',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="dark font-sans bg-background text-text">
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <main id="main-content" className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}