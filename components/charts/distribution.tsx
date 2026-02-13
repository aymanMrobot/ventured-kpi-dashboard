'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Table from '@/components/table';
import type { KeyCount } from '@/lib/metrics';
import { cn } from '@/lib/utils/cn';

interface DistributionProps {
  data: KeyCount[];
  label: string;
  ariaLabel: string;
  color?: string;
  className?: string;
}

/**
 * Distribution chart component for categorical counts. Uses a standard bar chart and provides
 * a hidden table fallback.
 */
export default function Distribution({ data, label, ariaLabel, color, className }: DistributionProps) {
  const chartData = data.map((item) => ({ name: item.key, value: item.count }));
  const headers = [label, 'Count'];
  const rows = chartData.map((d) => [d.name, d.value]);
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
            <XAxis dataKey="name" stroke="var(--color-muted)" style={{ fontSize: '12px' }} interval={0} angle={-35} textAnchor="end" height={80} />
            <YAxis stroke="var(--color-muted)" style={{ fontSize: '12px' }} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0B0F10', border: '1px solid var(--color-border)', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" name="Count" fill={color || 'var(--color-brand)'} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}