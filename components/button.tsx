'use client';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variantClasses: Record<Required<ButtonProps>['variant'], string> = {
  primary: 'bg-brand text-background hover:bg-brand-dark',
  secondary: 'bg-surface text-text border border-[var(--color-border)] hover:bg-surface/80',
  ghost: 'bg-transparent text-brand hover:bg-brand/10',
};

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}