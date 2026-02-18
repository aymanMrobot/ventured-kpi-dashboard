'use client';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-brand text-white font-semibold hover:opacity-90 active:opacity-80 shadow-[0_1px_3px_rgba(10,168,183,0.3)] hover:shadow-[0_2px_8px_rgba(10,168,183,0.4)]',
  secondary:
    'bg-[var(--color-surface-elevated)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border)]',
  ghost:
    'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]',
};

export default function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}