import { loadUKKpiData } from '@/lib/data/uk-kpi';
import Topbar from '@/components/topbar';
import SalesCharts from './sales-charts';

export const dynamic = 'force-dynamic';

function fmt(n: number | null | undefined, opts?: { currency?: boolean; compact?: boolean; pct?: boolean }): string {
  if (n == null) return '—';
  if (opts?.pct) return `${(n * 100).toFixed(1)}%`;
  if (opts?.currency && opts?.compact) {
    if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
    if (Math.abs(n) >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
    return `£${n.toLocaleString()}`;
  }
  if (opts?.currency) return `£${n.toLocaleString()}`;
  return n.toLocaleString();
}

function statusColor(status: 'good' | 'warn' | 'bad'): string {
  if (status === 'good') return '#22c55e';
  if (status === 'warn') return '#f59e0b';
  return '#ef4444';
}

function statusText(status: 'good' | 'warn' | 'bad'): string {
  if (status === 'good') return 'text-emerald-500';
  if (status === 'warn') return 'text-amber-500';
  return 'text-red-500';
}

export default async function SalesPage() {
  const data = await loadUKKpiData();
  const { sales, crossSell } = data;

  const forecastStatus: 'good' | 'warn' | 'bad' =
    sales.currentWeekForecastPct >= 0.9 ? 'good' : sales.currentWeekForecastPct >= 0.6 ? 'warn' : 'bad';
  const winRateStatus: 'good' | 'warn' | 'bad' =
    sales.currentWeekWinRate >= sales.winRateTarget ? 'good' : sales.currentWeekWinRate >= sales.winRateTarget * 0.8 ? 'warn' : 'bad';

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Sales" subtitle="UK Pipeline & Revenue · Weekly KPI Data" minDate="" maxDate="" />

      {/* ── Hero Badges ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Pipeline Gen (Current)',
            value: fmt(sales.currentWeekTotalPipeline, { currency: true, compact: true }),
            sub: `Target: ${fmt(sales.pipelineWeeklyTarget, { currency: true, compact: true })} weekly`,
          },
          {
            label: 'Bookings Closed Won (MTD)',
            value: fmt(sales.currentWeekBookings, { currency: true, compact: true }),
            sub: `ASP: ${fmt(sales.currentWeekASP, { currency: true })}`,
          },
          {
            label: 'Sales Forecast vs Objective',
            value: fmt(sales.currentWeekForecastPct, { pct: true }),
            sub: `FC: ${fmt(sales.currentWeekForecast, { currency: true, compact: true })} / Obj: ${fmt(sales.currentWeekObjective, { currency: true, compact: true })}`,
          },
        ].map((b) => (
          <div
            key={b.label}
            className="rounded-xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand) 100%)' }}
          >
            <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">{b.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{b.value}</p>
            <p className="text-xs text-white/60 mt-1">{b.sub}</p>
          </div>
        ))}
      </div>

      {/* ── KPI Cards ─────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Win Rate (MTD)',
            value: fmt(sales.currentWeekWinRate, { pct: true }),
            status: winRateStatus,
            sub: `Target: ${fmt(sales.winRateTarget, { pct: true })}`,
          },
          {
            label: 'Closed Won ASP',
            value: fmt(sales.currentWeekASP, { currency: true }),
            status: (sales.currentWeekASP >= sales.aspTarget ? 'good' : 'warn') as 'good' | 'warn' | 'bad',
            sub: `Target: ${fmt(sales.aspTarget, { currency: true })}`,
          },
          {
            label: 'Sales Pipeline Gen',
            value: fmt(sales.currentWeekSalesPipeline, { currency: true, compact: true }),
            status: 'warn' as const,
            sub: `of total ${fmt(sales.currentWeekTotalPipeline, { currency: true, compact: true })}`,
          },
          {
            label: 'Current Month Pipeline',
            value: fmt(sales.currentMonthPipeline, { currency: true, compact: true }),
            status: 'good' as const,
            sub: `Qtr Open: ${fmt(sales.currentQuarterOpenPipeline, { currency: true, compact: true })}`,
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 border-l-[3px] transition-colors duration-300"
            style={{ borderLeftColor: statusColor(c.status) }}
          >
            <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{c.label}</p>
            <p className="text-2xl font-bold mt-1.5">{c.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${statusText(c.status)}`}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: statusColor(c.status) }} />
              {c.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Cross-Sell Summary ─────────────────── */}
      <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden transition-colors duration-300">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold">Cross-Sell Performance</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
          {[
            { label: 'Daily Sales Activity', value: fmt(crossSell.currentActivity), sub: `Target: ${fmt(crossSell.activityTarget)}` },
            { label: 'Opps Created (MTD)', value: fmt(crossSell.currentOppsCreated), sub: `Target: ${fmt(crossSell.oppsTarget)}` },
            { label: 'Closed Won Target', value: fmt(crossSell.closedWonTarget, { currency: true, compact: true }), sub: `Stretch: ${fmt(crossSell.closedWonStretch, { currency: true, compact: true })}` },
            { label: 'Pipeline Value', value: fmt(crossSell.currentPipelineValue[crossSell.currentPipelineValue.length - 1]?.value, { currency: true, compact: true }), sub: 'Latest month' },
          ].map((c) => (
            <div key={c.label} className="p-3 rounded-lg bg-[var(--color-surface-elevated)]">
              <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{c.label}</p>
              <p className="text-xl font-bold mt-1">{c.value}</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts ────────────────────────────── */}
      <SalesCharts sales={sales} crossSell={crossSell} />
    </div>
  );
}