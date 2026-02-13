'use client';
import Button from '@/components/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== 'undefined') {
    console.error('[VenturEd Error]:', error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-slide-up">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted max-w-md">
          An unexpected error occurred. Please try again or contact support if the issue persists.
        </p>
      </div>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  );
}