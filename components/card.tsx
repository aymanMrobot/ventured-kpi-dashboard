import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[var(--color-surface)] backdrop-blur-sm border border-[var(--color-border)] p-5',
        'shadow-[var(--shadow-card)]',
        'hover:border-[var(--color-muted)]/20 transition-all duration-200',
        className,
      )}
    >
      {children}
    </div>
  );
}