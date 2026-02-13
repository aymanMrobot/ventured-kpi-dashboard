import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'VenturEd KPI Dashboard',
  description: 'Executive KPI dashboard for VenturEd Solutions — Track calls, emails, sales, and support metrics.',
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
          <div className="flex flex-1 flex-col overflow-x-hidden">
            <main id="main-content" className="flex-1 p-6 md:p-8 lg:p-10">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}