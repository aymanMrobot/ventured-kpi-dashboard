import { loadCalls, loadEmails } from '@/lib/data/excel';
import { parseIsoDate } from '@/lib/utils/date';
import { computeSupportMetrics } from '@/lib/metrics';
import Topbar from '@/components/topbar';
import TrendLine from '@/components/charts/trend-line';
import BarRanked from '@/components/charts/bar-ranked';
import Distribution from '@/components/charts/distribution';

export const dynamic = 'force-dynamic';


interface SupportPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function SupportPage({ searchParams }: SupportPageProps) {
  const [calls, emails] = await Promise.all([loadCalls(), loadEmails()]);
  const allDates = [...calls.map((c) => c.date), ...emails.map((e) => e.date)];
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
  const metrics = computeSupportMetrics(calls, emails, from, to);
  const series = [
    { name: 'Activities', data: metrics.trend, color: 'var(--color-brand)' },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Support" subtitle="Support activity" minDate={minDate} maxDate={maxDate} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Support performers</h2>
          <BarRanked data={metrics.topPerformers} label="User" valueLabel="Activities" ariaLabel="Support performers" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Support call outcomes</h2>
          <Distribution data={metrics.callsByOutcome} label="Outcome" ariaLabel="Support call outcomes" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Support email status</h2>
          <Distribution data={metrics.emailsByStatus} label="Status" ariaLabel="Support email status" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Support activity trend</h2>
          <TrendLine series={series} ariaLabel="Support activities per day" />
        </div>
      </div>
    </div>
  );
}