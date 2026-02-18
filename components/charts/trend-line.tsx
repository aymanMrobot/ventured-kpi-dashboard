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
  ariaLabel: string;
}

/** Format ISO date to a short readable label. */
function shortDate(iso: string) {
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  return `${parts[2]}/${parts[1]}`;
}

export default function TrendLine({ series, ariaLabel, className }: TrendLineProps) {
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

  const headers = ['Date', ...series.map((s) => s.name)];
  const rows = combined.map((row) => [
    row.date,
    ...series.map((s) => row[s.name] as number),
  ]);

  // Show a max of ~10 ticks on x-axis to avoid crowding
  const tickInterval = Math.max(0, Math.floor(combined.length / 10) - 1);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div aria-label={ariaLabel} className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combined} margin={{ top: 5, right: 24, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickLine={false}
              tickFormatter={shortDate}
              interval={tickInterval}
            />
            <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-card)', color: 'var(--color-text)' }}
              cursor={{ stroke: 'var(--chart-grid)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            {series.map((s, index) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color || `var(--color-brand${index % 2 === 0 ? '' : '-light'})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: 'var(--color-surface)' }}
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