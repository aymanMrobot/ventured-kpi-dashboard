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
  Mail,
  Sparkles,
  Settings,
  Megaphone,
  Users,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { href: '/sales', label: 'Sales', icon: <TrendingUp size={18} /> },
  { href: '/marketing', label: 'Marketing', icon: <Megaphone size={18} /> },
  { href: '/support', label: 'Support', icon: <Headphones size={18} /> },
  { href: '/csm', label: 'CSM', icon: <Users size={18} /> },
  { href: '/devops', label: 'DevOps', icon: <Server size={18} /> },
  { href: '/emails', label: 'Emails', icon: <Mail size={18} /> },
  { href: '/ai', label: 'AI Insights', icon: <Sparkles size={18} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const environment = process.env.NODE_ENV;

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
              'hover:bg-white/[0.06] focus-visible:bg-white/[0.08] focus-visible:outline-none',
              isActive
                ? 'bg-brand/15 text-brand shadow-[inset_0_0_0_1px_rgba(10,168,183,0.2)]'
                : 'text-text/70 hover:text-text',
            )}
            onClick={() => setOpen(false)}
          >
            <span className={cn('flex-shrink-0', isActive ? 'text-brand' : 'text-text/50')}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label="Open navigation"
        className="fixed top-4 left-4 z-50 md:hidden rounded-lg bg-surface/80 backdrop-blur-sm p-2.5 text-brand border border-white/[0.06] shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-[260px] flex-col border-r border-white/[0.06] bg-surface/50 backdrop-blur-xl">
        <div className="flex items-center justify-center px-6 py-8">
          <Image
            src="/brand/ventured-logo.png"
            alt="VenturEd Solutions"
            width={80}
            height={80}
            className="rounded-2xl"
          />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-4" />

        {navLinks}

        <div className="mt-auto px-6 py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />
          <div className="flex items-center gap-2">
            <div className={cn(
              'h-2 w-2 rounded-full',
              environment === 'development' ? 'bg-amber-400' : 'bg-emerald-400',
            )} />
            <span className="text-[11px] text-text/40 font-medium">
              {environment === 'development' ? 'Development' : 'Production'} · v1.0.0
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile drawer using Radix Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed inset-y-0 left-0 w-[280px] bg-surface/95 backdrop-blur-xl z-50 p-0 focus:outline-none border-r border-white/[0.06] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Image
                  src="/brand/ventured-logo.png"
                  alt="VenturEd Solutions"
                  width={60}
                  height={60}
                  className="rounded-xl"
                />
              </div>
              <button
                aria-label="Close navigation"
                className="rounded-lg p-2 text-text/50 hover:text-text hover:bg-white/[0.06] transition-colors"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-4" />

            {navLinks}

            <div className="mt-auto px-6 py-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  environment === 'development' ? 'bg-amber-400' : 'bg-emerald-400',
                )} />
                <span className="text-[11px] text-text/40 font-medium">
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