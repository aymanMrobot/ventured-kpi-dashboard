import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface/80 backdrop-blur-sm border border-white/[0.06] p-5',
        'shadow-[0_1px_3px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]',
        'hover:border-white/[0.1] transition-all duration-200',
        className,
      )}
    >
      {children}
    </div>
  );
}