'use client';
import type { ReactNode } from 'react';
import DateRangePicker from './date-range';

interface TopbarProps {
  title: string;
  subtitle?: string;
  minDate: string;
  maxDate: string;
  children?: ReactNode;
}

/**
 * The topbar appears at the top of each page and contains the page title,
 * optional subtitle, a date range picker and any additional actions.
 */
export default function Topbar({ title, subtitle, minDate, maxDate, children }: TopbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 border-b border-white/[0.06]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-text to-text/70 bg-clip-text">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {minDate && maxDate && <DateRangePicker min={minDate} max={maxDate} />}
        {children}
      </div>
    </div>
  );
}