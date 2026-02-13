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
 * Date range picker that syncs with URL search params
 */
export default function DateRangePicker({ min, max }: DateRangeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(searchParams.get('from') || min);
  const [to, setTo] = useState(searchParams.get('to') || max);

  useEffect(() => {
    if (searchParams.get('from')) setFrom(searchParams.get('from')!);
    if (searchParams.get('to')) setTo(searchParams.get('to')!);
  }, [searchParams]);

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('from', from);
    params.set('to', to);
    router.push(`?${params.toString()}`);
  }

  const fromParsed = parseIsoDate(from);
  const toParsed = parseIsoDate(to);
  const isValid = fromParsed && toParsed && fromParsed <= toParsed;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-1.5">
        <label htmlFor="date-from" className="text-[11px] font-medium text-muted uppercase tracking-wider">
          From
        </label>
        <input
          id="date-from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="bg-transparent text-sm text-text focus:outline-none [color-scheme:dark]"
          min={min}
          max={max}
          aria-label="Start date"
        />
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-1.5">
        <label htmlFor="date-to" className="text-[11px] font-medium text-muted uppercase tracking-wider">
          To
        </label>
        <input
          id="date-to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="bg-transparent text-sm text-text focus:outline-none [color-scheme:dark]"
          min={min}
          max={max}
          aria-label="End date"
        />
      </div>
      <button
        onClick={handleApply}
        disabled={!isValid}
        className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-background transition-all duration-200 hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_1px_3px_rgba(10,168,183,0.3)]"
      >
        Apply
      </button>
    </div>
  );
}