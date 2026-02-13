'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/overview', label: 'Overview' },
  { href: '/sales', label: 'Sales' },
  { href: '/support', label: 'Support' },
  { href: '/emails', label: 'Emails' },
  { href: '/ai', label: 'AI Insights' },
  { href: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const environment = process.env.NODE_ENV;

  const navLinks = (
    <nav aria-label="Main navigation" className="mt-6 flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-brand/10 focus-visible:bg-brand/20 focus-visible:outline-none',
              isActive ? 'bg-brand/20 text-brand' : 'text-text',
            )}
            onClick={() => setOpen(false)}
          >
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
        className="md:hidden p-3 text-brand"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-[var(--color-border)] bg-surface p-4">
        <div className="flex items-center gap-2">
          <Image src="/brand/ventured-logo.png" alt="VenturEd Solutions" width={32} height={32} />
          <span className="text-lg font-semibold">VenturEd</span>
        </div>
        {navLinks}
        <div className="mt-auto pt-4 text-xs text-muted">
          {environment === 'development' ? 'Development' : 'Production'}
        </div>
      </aside>
      {/* Mobile drawer using Radix Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed inset-y-0 left-0 w-72 bg-surface p-4 focus:outline-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Image src="/brand/ventured-logo.png" alt="VenturEd Solutions" width={32} height={32} />
                <span className="text-lg font-semibold">VenturEd</span>
              </div>
              <button
                aria-label="Close navigation"
                className="p-2 text-brand"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            {navLinks}
            <div className="mt-auto pt-4 text-xs text-muted">
              {environment === 'development' ? 'Development' : 'Production'}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}