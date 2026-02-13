import { computeSalesMetrics } from '@/lib/metrics';
import { loadCalls } from '@/lib/data/excel';
import { parseIsoDate } from '@/lib/utils/date';
import Topbar from '@/components/topbar';
import TrendLine from '@/components/charts/trend-line';
import BarRanked from '@/components/charts/bar-ranked';
import Distribution from '@/components/charts/distribution';

export const dynamic = 'force-dynamic';


interface SalesPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function SalesPage({ searchParams }: SalesPageProps) {
  const calls = await loadCalls();
  const allDates = calls.map((c) => c.date);
  let minDate = allDates[0];
  let maxDate = allDates[0];
  allDates.forEach((d) => {
    if (d < minDate) minDate = d;
    if (d > maxDate) maxDate = d;
  });
  let from = searchParams.from ?? minDate;
  let to = searchParams.to ?? maxDate;
  const fromParsed = parseIsoDate(from);
  const toParsed = parseIsoDate(to);
  if (!fromParsed || !toParsed || fromParsed > toParsed) {
    from = minDate;
    to = maxDate;
  }
  const metrics = computeSalesMetrics(calls, from, to);
  const series = [
    { name: 'Calls', data: metrics.callsTrend, color: 'var(--color-brand)' },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Sales" subtitle="Call activity" minDate={minDate} maxDate={maxDate} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Top performers</h2>
          <BarRanked data={metrics.callsByUser} label="User" valueLabel="Calls" ariaLabel="Calls by user" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Calls by outcome</h2>
          <Distribution data={metrics.callsByOutcome} label="Outcome" ariaLabel="Calls by outcome" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Calls by topic</h2>
          <Distribution data={metrics.callsByTopic} label="Topic" ariaLabel="Calls by topic" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Call trend</h2>
          <TrendLine series={series} ariaLabel="Calls per day" />
        </div>
      </div>
    </div>
  );
}