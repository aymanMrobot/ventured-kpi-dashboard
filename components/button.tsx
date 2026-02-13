'use client';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-brand text-background font-semibold hover:bg-brand-light active:bg-brand-dark shadow-[0_1px_3px_rgba(10,168,183,0.3)] hover:shadow-[0_2px_8px_rgba(10,168,183,0.4)]',
  secondary:
    'bg-white/[0.06] text-text border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.12]',
  ghost:
    'text-text/70 hover:text-text hover:bg-white/[0.06]',
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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