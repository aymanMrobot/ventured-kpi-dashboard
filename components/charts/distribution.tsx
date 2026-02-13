'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import Table from '@/components/table';
import type { KeyCount } from '@/lib/metrics';
import { cn } from '@/lib/utils/cn';

interface DistributionProps {
  data: KeyCount[];
  className?: string;
  ariaLabel: string;
  label?: string;
}

/** Truncate long category names for the x-axis. */
function truncate(str: string, max = 12) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function Distribution({ data, ariaLabel, className }: DistributionProps) {
  const headers = ['Category', 'Count'];
  const rows = data.map((d) => [d.key, d.count]);
  const chartData = data.map((d) => ({ ...d, shortKey: truncate(d.key) }));

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 24, left: 0, bottom: 56 }}>
            <XAxis
              dataKey="shortKey"
              tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              formatter={(value: number) => [value, 'Count']}
              labelFormatter={(label: string) => {
                const item = chartData.find((d) => d.shortKey === label);
                return item ? item.key : label;
              }}
            />
            <Bar dataKey="count" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}