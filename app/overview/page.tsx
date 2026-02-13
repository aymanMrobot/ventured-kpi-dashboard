import { computeOverviewMetrics } from '@/lib/metrics';
import { loadCalls, loadEmails } from '@/lib/data/excel';
import { parseIsoDate } from '@/lib/utils/date';
import Topbar from '@/components/topbar';
import KpiCard from '@/components/kpi-card';
import Card from '@/components/card';
import TrendLine from '@/components/charts/trend-line';
import BarRanked from '@/components/charts/bar-ranked';

export const dynamic = 'force-dynamic';

interface OverviewPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
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
  const metrics = computeOverviewMetrics(calls, emails, from, to);

  // Compute extra summary stats
  const avgDailyActivities = metrics.totalActivities > 0
    ? Math.round(metrics.totalActivities / Math.max(1, new Set([...calls.map(c => c.date), ...emails.map(e => e.date)].filter(d => d >= from && d <= to)).size))
    : 0;

  // Top performer across all activities
  const performers: Record<string, number> = {};
  calls.filter(c => c.date >= from && c.date <= to).forEach(c => {
    performers[c.assignedTo] = (performers[c.assignedTo] || 0) + 1;
  });
  emails.filter(e => e.date >= from && e.date <= to).forEach(e => {
    performers[e.assignedTo] = (performers[e.assignedTo] || 0) + 1;
  });
  const topPerformer = Object.entries(performers).sort((a, b) => b[1] - a[1])[0];

  // Top account
  const topAccount = metrics.topAccounts[0];

  const series = [
    { name: 'Calls', data: metrics.callsByDay, color: 'var(--color-brand)' },
    { name: 'Emails', data: metrics.emailsByDay, color: 'var(--color-brand-light)' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Overview" subtitle="Executive summary" minDate={minDate} maxDate={maxDate} />

      {/* Executive Summary */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Period Summary</h2>
            <p className="text-sm text-text/70 leading-relaxed">
              Between <span className="font-medium text-text">{from}</span> and <span className="font-medium text-text">{to}</span>, the team
              logged <span className="font-medium text-brand">{metrics.totalActivities.toLocaleString()} total activities</span> —
              {' '}<span className="font-medium text-text">{metrics.totalCalls.toLocaleString()} calls</span> and
              {' '}<span className="font-medium text-text">{metrics.totalEmails.toLocaleString()} emails</span>,
              averaging <span className="font-medium text-text">{avgDailyActivities} activities per day</span> across
              {' '}<span className="font-medium text-text">{metrics.activeUsers} active team members</span>.
              {topPerformer && (
                <> The top performer is <span className="font-medium text-brand">{topPerformer[0]}</span> with {topPerformer[1].toLocaleString()} activities.</>
              )}
              {topAccount && (
                <> The most engaged account is <span className="font-medium text-brand">{topAccount.key}</span> with {topAccount.count.toLocaleString()} interactions.</>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="flex overflow-x-auto gap-4 scroll-snap-type-x mandatory pb-2">
        <KpiCard title="Total activities" value={metrics.totalActivities} subtitle={`${from} to ${to}`} />
        <KpiCard title="Total calls" value={metrics.totalCalls} />
        <KpiCard title="Total emails" value={metrics.totalEmails} />
        <KpiCard title="Active users" value={metrics.activeUsers} />
        <KpiCard title="Avg daily activities" value={avgDailyActivities} />
      </div>

      {/* Charts */}
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