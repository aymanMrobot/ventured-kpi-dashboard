'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Table from '@/components/table';
import type { TimeSeriesPoint } from '@/lib/metrics';
import { cn } from '@/lib/utils/cn';

interface Series {
  name: string;
  data: TimeSeriesPoint[];
  color?: string;
}

interface TrendLineProps {
  series: Series[];
  className?: string;
  /** Accessible label for the chart */
  ariaLabel: string;
}

/**
 * Trend line chart component supporting multiple series. Provides a tabular fallback for
 * accessibility and screen readers.
 */
export default function TrendLine({ series, ariaLabel, className }: TrendLineProps) {
  // Build a combined data array keyed by date
  const dateSet = new Set<string>();
  series.forEach((s) => {
    s.data.forEach((pt) => dateSet.add(pt.date));
  });
  const dates = Array.from(dateSet).sort();
  const combined = dates.map((date) => {
    const entry: any = { date };
    series.forEach((s) => {
      const point = s.data.find((p) => p.date === date);
      entry[s.name] = point ? point.count : 0;
    });
    return entry;
  });
  // Prepare fallback table rows: first column is date, then one column per series
  const headers = ['Date', ...series.map((s) => s.name)];
  const rows = combined.map((row) => [
    row.date,
    ...series.map((s) => row[s.name] as number),
  ]);
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="var(--color-muted)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--color-muted)" style={{ fontSize: '12px' }} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0B0F10', border: '1px solid var(--color-border)', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {series.map((s, index) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color || `var(--color-brand${index % 2 === 0 ? '' : '-light'})`}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <Table headers={headers} rows={rows} />
      </div>
    </div>
  );
}