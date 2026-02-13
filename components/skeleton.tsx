import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  'aria-label'?: string;
}

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white/[0.04] animate-pulse',
        className,
      )}
      role="status"
      aria-label={props['aria-label'] || 'Loading…'}
    />
  );
}