'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseIsoDate } from '@/lib/utils/date';

interface DateRangeProps {
  /** Minimum selectable date in ISO yyyy-MM-dd format */
  min: string;
  /** Maximum selectable date in ISO yyyy-MM-dd format */
  max: string;
}

/**
 * A simple date range picker that reads and writes `from` and `to` values via the URL
 * search parameters. When the values change the page URL is updated without a full reload.
 */
export default function DateRangePicker({ min, max }: DateRangeProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Read initial values from the query string or fall back to the provided min/max
  const urlFrom = searchParams.get('from') || min;
  const urlTo = searchParams.get('to') || max;
  const [from, setFrom] = useState(urlFrom);
  const [to, setTo] = useState(urlTo);

  // Keep internal state in sync when the URL changes
  useEffect(() => {
    setFrom(urlFrom);
    setTo(urlTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlFrom, urlTo]);

  function applyRange(newFrom: string, newTo: string) {
    // Validate dates
    const fromDate = parseIsoDate(newFrom);
    const toDate = parseIsoDate(newTo);
    if (!fromDate || !toDate || fromDate > toDate) {
      return;
    }
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('from', newFrom);
    params.set('to', newTo);
    // Update the current route without scroll
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyRange(from, to);
      }}
      className="flex items-end gap-2"
    >
      <div className="flex flex-col">
        <label htmlFor="from-date" className="text-xs text-muted mb-1">
          From
        </label>
        <input
          id="from-date"
          name="from"
          type="date"
          value={from}
          min={min}
          max={to}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-md bg-surface border border-[var(--color-border)] text-sm px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="to-date" className="text-xs text-muted mb-1">
          To
        </label>
        <input
          id="to-date"
          name="to"
          type="date"
          value={to}
          min={from}
          max={max}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-md bg-surface border border-[var(--color-border)] text-sm px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-brand text-background px-3 py-2 text-sm font-medium hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        Apply
      </button>
    </form>
  );
}