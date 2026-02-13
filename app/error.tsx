'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to the console. You could also report it to an analytics service.
    console.error(error);
  }, [error]);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-muted">An unexpected error occurred. Please try again.</p>
      <button
        onClick={() => reset()}
        className="rounded bg-brand px-4 py-2 text-background hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        Try again
      </button>
    </div>
  );
}