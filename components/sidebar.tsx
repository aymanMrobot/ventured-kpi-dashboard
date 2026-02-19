'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  Headphones,
  Sparkles,
  Settings,
  Megaphone,
  Users,
  Server,
  Sun,
  Moon,
  Banknote,
  Box,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/components/theme-provider';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { href: '/sales', label: 'Sales', icon: <TrendingUp size={18} /> },
  { href: '/marketing', label: 'Marketing', icon: <Megaphone size={18} /> },
  { href: '/finance', label: 'Finance', icon: <Banknote size={18} /> },
  { href: '/product', label: 'Product', icon: <Box size={18} /> },
  { href: '/retention', label: 'Retention', icon: <ShieldCheck size={18} /> },
  { href: '/customer-management', label: 'Customer Mgmt', icon: <UserCheck size={18} /> },
  { href: '/support', label: 'Support', icon: <Headphones size={18} /> },
  { href: '/csm', label: 'CSM', icon: <Users size={18} /> },
  { href: '/devops', label: 'DevOps', icon: <Server size={18} /> },
  { href: '/ai', label: 'AI Insights', icon: <Sparkles size={18} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const environment = process.env.NODE_ENV;

  const logoSrc = theme === 'dark' ? '/brand/ventured-logo.png' : '/brand/logo.png';

  const navLinks = (
    <nav aria-label="Main navigation" className="mt-8 flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'hover:bg-[var(--color-border)] focus-visible:bg-[var(--color-border)] focus-visible:outline-none',
              isActive
                ? 'bg-brand/15 text-brand shadow-[inset_0_0_0_1px_rgba(10,168,183,0.2)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
            )}
            onClick={() => setOpen(false)}
          >
            <span className={cn('flex-shrink-0', isActive ? 'text-brand' : 'text-[var(--color-muted)]')}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const themeToggle = (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-all duration-200 w-full"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label="Open navigation"
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-[var(--color-surface)] backdrop-blur-sm p-2.5 text-brand border border-[var(--color-border)] shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-[260px] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-300">
        <div className="flex items-center justify-center px-4 py-8">
          <Image
            src={logoSrc}
            alt="VenturEd Solutions"
            width={200}
            height={65}
            className="object-contain"
            priority
          />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mx-4" />

        {navLinks}

        <div className="mt-auto px-6 py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mb-4" />
          {themeToggle}
          <div className="flex items-center gap-2 mt-3">
            <div className={cn(
              'h-2 w-2 rounded-full',
              environment === 'development' ? 'bg-amber-400' : 'bg-emerald-400',
            )} />
            <span className="text-[11px] text-[var(--color-muted)] font-medium">
              {environment === 'development' ? 'Development' : 'Production'} · v1.0.0
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile drawer using Radix Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed inset-y-0 left-0 w-[280px] bg-[var(--color-surface)] backdrop-blur-xl z-50 p-0 focus:outline-none border-r border-[var(--color-border)] shadow-2xl transition-colors duration-300">
            <div className="flex items-center justify-between px-4 py-5">
              <div className="flex items-center gap-3">
                <Image
                  src={logoSrc}
                  alt="VenturEd Solutions"
                  width={160}
                  height={52}
                  className="object-contain"
                  priority
                />
              </div>
              <button
                aria-label="Close navigation"
                className="rounded-lg p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mx-4" />

            {navLinks}

            <div className="mt-auto px-6 py-4">
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent mb-4" />
              {themeToggle}
              <div className="flex items-center gap-2 mt-3">
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  environment === 'development' ? 'bg-amber-400' : 'bg-emerald-400',
                )} />
                <span className="text-[11px] text-[var(--color-muted)] font-medium">
                  {environment === 'development' ? 'Development' : 'Production'} · v1.0.0
                </span>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}