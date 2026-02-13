import { loadEmails } from '@/lib/data/excel';
import { parseIsoDate } from '@/lib/utils/date';
import { computeEmailsMetrics } from '@/lib/metrics';
import Topbar from '@/components/topbar';
import TrendLine from '@/components/charts/trend-line';
import BarRanked from '@/components/charts/bar-ranked';
import Distribution from '@/components/charts/distribution';

export const dynamic = 'force-dynamic';


interface EmailsPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function EmailsPage({ searchParams }: EmailsPageProps) {
  const emails = await loadEmails();
  const allDates = emails.map((e) => e.date);
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
  const metrics = computeEmailsMetrics(emails, from, to);
  const series = [
    { name: 'Emails', data: metrics.emailsTrend, color: 'var(--color-brand)' },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Emails" subtitle="Email activity" minDate={minDate} maxDate={maxDate} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Emails by user</h2>
          <BarRanked data={metrics.emailsByUser} label="User" valueLabel="Emails" ariaLabel="Emails by user" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Email statuses</h2>
          <Distribution data={metrics.emailsByStatus} label="Status" ariaLabel="Emails by status" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Top subjects</h2>
          <BarRanked data={metrics.topSubjects} label="Subject" valueLabel="Count" ariaLabel="Top email subjects" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Email trend</h2>
          <TrendLine series={series} ariaLabel="Emails per day" />
        </div>
      </div>
    </div>
  );
}