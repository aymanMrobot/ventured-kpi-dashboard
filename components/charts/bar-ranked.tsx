'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Table from '@/components/table';
import type { KeyCount } from '@/lib/metrics';
import { cn } from '@/lib/utils/cn';

interface BarRankedProps {
  data: KeyCount[];
  className?: string;
  ariaLabel: string;
  label?: string;
  valueLabel?: string;
}

export default function BarRanked({ data, ariaLabel, className }: BarRankedProps) {
  const headers = ['Name', 'Count'];
  const rows = data.map((d) => [d.key, d.count]);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 80, bottom: 0 }}>
            <XAxis type="number" stroke="var(--color-muted)" style={{ fontSize: '11px' }} tick={{ fill: 'var(--color-muted)' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="key" stroke="var(--color-muted)" style={{ fontSize: '11px' }} tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" fill="var(--color-brand)" radius={[0, 4, 4, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}