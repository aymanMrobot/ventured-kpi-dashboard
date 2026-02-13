'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
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

/** Truncate long labels to keep the chart readable. */
function truncate(str: string, max = 16) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export default function BarRanked({ data, ariaLabel, className }: BarRankedProps) {
  const headers = ['Name', 'Count'];
  const rows = data.map((d) => [d.key, d.count]);
  const chartData = data.map((d) => ({ ...d, shortKey: truncate(d.key) }));

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 24, left: 10, bottom: 5 }}>
            <XAxis type="number" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="shortKey"
              width={110}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              formatter={(value: number) => [value, 'Count']}
              labelFormatter={(label: string) => {
                const item = chartData.find((d) => d.shortKey === label);
                return item ? item.key : label;
              }}
            />
            <Bar dataKey="count" fill="var(--color-brand)" radius={[0, 4, 4, 0]} maxBarSize={24} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}