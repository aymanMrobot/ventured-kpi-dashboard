import { computeOverviewMetrics } from '@/lib/metrics';
import { loadCalls, loadEmails } from '@/lib/data/excel';
import { parseIsoDate } from '@/lib/utils/date';
import Topbar from '@/components/topbar';
import KpiCard from '@/components/kpi-card';
import TrendLine from '@/components/charts/trend-line';
import BarRanked from '@/components/charts/bar-ranked';

export const dynamic = 'force-dynamic';


interface OverviewPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
  const [calls, emails] = await Promise.all([loadCalls(), loadEmails()]);
  // Compute global min/max dates across calls and emails
  const allDates = [...calls.map((c) => c.date), ...emails.map((e) => e.date)];
  // Determine min and max dates
  let minDate = allDates[0];
  let maxDate = allDates[0];
  allDates.forEach((d) => {
    if (d < minDate) minDate = d;
    if (d > maxDate) maxDate = d;
  });
  // Get query params
  let from = searchParams.from ?? minDate;
  let to = searchParams.to ?? maxDate;
  // Validate query params
  const fromParsed = parseIsoDate(from);
  const toParsed = parseIsoDate(to);
  if (!fromParsed || !toParsed || fromParsed > toParsed) {
    from = minDate;
    to = maxDate;
  }
  const metrics = computeOverviewMetrics(calls, emails, from, to);
  // Prepare series for trend line
  const series = [
    { name: 'Calls', data: metrics.callsByDay, color: 'var(--color-brand)' },
    { name: 'Emails', data: metrics.emailsByDay, color: 'var(--color-brand-light)' },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Overview" subtitle="Executive summary" minDate={minDate} maxDate={maxDate} />
      <div className="flex overflow-x-auto gap-4 scroll-snap-type-x mandatory pb-2">
        <KpiCard title="Total activities" value={metrics.totalActivities} subtitle={`From ${from} to ${to}`} />
        <KpiCard title="Total calls" value={metrics.totalCalls} />
        <KpiCard title="Total emails" value={metrics.totalEmails} />
        <KpiCard title="Active users" value={metrics.activeUsers} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Activity trend</h2>
          <TrendLine series={series} ariaLabel="Calls and emails per day" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Top accounts</h2>
          <BarRanked data={metrics.topAccounts} label="Account" valueLabel="Activities" ariaLabel="Top accounts by activity" />
        </div>
      </div>
    </div>
  );
}