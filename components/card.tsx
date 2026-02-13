import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface p-4 shadow-sm border border-[var(--color-border)]',
        className,
      )}
    >
      {children}
    </div>
  );
}