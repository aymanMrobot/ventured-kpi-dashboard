'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Table from '@/components/table';
import type { KeyCount } from '@/lib/metrics';
import { cn } from '@/lib/utils/cn';

interface DistributionProps {
  data: KeyCount[];
  className?: string;
  ariaLabel: string;
  label?: string;
}

export default function Distribution({ data, ariaLabel, className }: DistributionProps) {
  const headers = ['Category', 'Count'];
  const rows = data.map((d) => [d.key, d.count]);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <XAxis dataKey="key" stroke="var(--color-muted)" style={{ fontSize: '11px' }} tick={{ fill: 'var(--color-muted)' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} angle={-30} textAnchor="end" />
            <YAxis stroke="var(--color-muted)" style={{ fontSize: '11px' }} tick={{ fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: '#111617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}