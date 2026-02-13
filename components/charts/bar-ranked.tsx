'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Table from '@/components/table';
import type { KeyCount } from '@/lib/metrics';
import { cn } from '@/lib/utils/cn';

interface BarRankedProps {
  data: KeyCount[];
  /** Label for the name axis */
  label: string;
  /** Label for the value axis */
  valueLabel: string;
  color?: string;
  ariaLabel: string;
  className?: string;
}

/**
 * Bar chart component for ranked key/count pairs. Includes a hidden table fallback.
 */
export default function BarRanked({ data, label, valueLabel, color, ariaLabel, className }: BarRankedProps) {
  const chartData = data.map((item) => ({ name: item.key, value: item.count }));
  const headers = [label, valueLabel];
  const rows = chartData.map((d) => [d.name, d.value]);
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
            <XAxis type="number" stroke="var(--color-muted)" style={{ fontSize: '12px' }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="var(--color-muted)" style={{ fontSize: '12px' }} width={120} />
            <Tooltip contentStyle={{ backgroundColor: '#0B0F10', border: '1px solid var(--color-border)', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" name={valueLabel} fill={color || 'var(--color-brand)'} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}