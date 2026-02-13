import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

/**
 * A simple skeleton loader used as a placeholder while content is loading.
 */
export default function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded bg-surface/50', className)} />;
}