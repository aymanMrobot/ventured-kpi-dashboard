import { loadMarketingData } from '@/lib/data/marketing';
import Topbar from '@/components/topbar';
import MarketingCharts from './marketing-charts';

export const dynamic = 'force-dynamic';

function fmt(n: number | null | undefined, opts?: { currency?: boolean; compact?: boolean }): string {
    if (n == null) return '—';
    if (opts?.currency && opts?.compact) {
        if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
        if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
        return `£${n.toLocaleString()}`;
    }
    if (opts?.currency) return `£${n.toLocaleString()}`;
    return n.toLocaleString();
}

function pctColor(pct: number | null): string {
    if (pct == null) return 'text-[var(--color-muted)]';
    if (pct >= 90) return 'text-emerald-500';
    if (pct >= 60) return 'text-amber-500';
    return 'text-red-500';
}

function borderColor(pct: number | null): string {
    if (pct == null) return '#6B7280';
    if (pct >= 90) return '#22c55e';
    if (pct >= 60) return '#f59e0b';
    return '#ef4444';
}

export default async function MarketingPage() {
    const data = await loadMarketingData();
    const { ytd, monthly, quarterly, priorYears, priorYearsTotals, yearOnYear, pipelineGap } = data;

    return (
        <div className="flex flex-col gap-6">
            <Topbar title="Marketing" subtitle="UK Demand Generation · 2026 Targets & Performance" minDate="" maxDate="" />

            {/* ── Executive Achievement Badges ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'YTD MQL Achievement', value: `${ytd.mqlAchievement}%`, sub: `${fmt(ytd.mqlActual)} / ${fmt(ytd.mqlTarget)}` },
                    { label: 'YTD SQL Achievement', value: `${ytd.sqlAchievement}%`, sub: `${fmt(ytd.sqlActual)} / ${fmt(ytd.sqlTarget)}` },
                    { label: 'YTD Pipeline', value: fmt(ytd.pipelineActual, { currency: true, compact: true }), sub: `${ytd.pipelineAchievement}% of ${fmt(ytd.pipelineTarget, { currency: true, compact: true })} target` },
                ].map((b) => (
                    <div
                        key={b.label}
                        className="rounded-xl p-5 text-center"
                        style={{ background: 'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)' }}
                    >
                        <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">{b.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">{b.value}</p>
                        <p className="text-xs text-white/60 mt-1">{b.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Funnel KPI Cards ─────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'MQLs Generated', value: fmt(ytd.mqlActual), pct: ytd.mqlAchievement, sub: `Target: ${fmt(ytd.mqlTarget)}` },
                    { label: 'SQLs Qualified', value: fmt(ytd.sqlActual), pct: ytd.sqlAchievement, sub: `Target: ${fmt(ytd.sqlTarget)}` },
                    { label: 'MQL→SQL Rate', value: `${ytd.conversionRate}%`, pct: null, sub: 'Funnel efficiency' },
                    { label: 'Avg Selling Price', value: fmt(ytd.aspActual, { currency: true }), pct: Math.round((ytd.aspActual / ytd.aspTarget) * 100), sub: `Target: ${fmt(ytd.aspTarget, { currency: true })}` },
                    { label: 'Pipeline Created', value: fmt(ytd.pipelineActual, { currency: true, compact: true }), pct: ytd.pipelineAchievement, sub: `Target: ${fmt(ytd.pipelineTarget, { currency: true, compact: true })}` },
                    { label: 'Marketing Sales', value: fmt(ytd.marketingSalesActual, { currency: true, compact: true }), pct: ytd.marketingSalesTarget > 0 ? Math.round((ytd.marketingSalesActual / ytd.marketingSalesTarget) * 100) : 0, sub: `Target: ${fmt(ytd.marketingSalesTarget, { currency: true, compact: true })}` },
                ].map((c) => (
                    <div
                        key={c.label}
                        className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 border-l-[3px] transition-colors duration-300"
                        style={{ borderLeftColor: borderColor(c.pct) }}
                    >
                        <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{c.label}</p>
                        <p className="text-2xl font-bold mt-1.5">{c.value}</p>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${pctColor(c.pct)}`}>
                            {c.pct != null && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: borderColor(c.pct) }} />}
                            {c.pct != null ? `${c.pct}% · ` : ''}{c.sub}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Quarterly Performance Table ──────────────────── */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden transition-colors duration-300">
                <div className="px-5 py-4 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold">Quarterly Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                                <th className="px-5 py-3 text-left font-medium">Quarter</th>
                                <th className="px-5 py-3 text-right font-medium">MQL Target</th>
                                <th className="px-5 py-3 text-right font-medium">MQL Actual</th>
                                <th className="px-5 py-3 text-right font-medium">%</th>
                                <th className="px-5 py-3 text-right font-medium">SQL Target</th>
                                <th className="px-5 py-3 text-right font-medium">SQL Actual</th>
                                <th className="px-5 py-3 text-right font-medium">Pipeline Target</th>
                                <th className="px-5 py-3 text-right font-medium">Pipeline Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quarterly.map((q) => (
                                <tr key={q.quarter} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                    <td className="px-5 py-3 font-semibold">{q.quarter}</td>
                                    <td className="px-5 py-3 text-right">{fmt(q.mqlTarget)}</td>
                                    <td className="px-5 py-3 text-right font-medium">{fmt(q.mqlActual)}</td>
                                    <td className={`px-5 py-3 text-right font-semibold ${pctColor(q.mqlPct)}`}>{q.mqlPct}%</td>
                                    <td className="px-5 py-3 text-right">{fmt(q.sqlTarget)}</td>
                                    <td className="px-5 py-3 text-right font-medium">{fmt(q.sqlActual)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(q.pipelineTarget, { currency: true, compact: true })}</td>
                                    <td className="px-5 py-3 text-right font-medium">{fmt(q.pipelineActual, { currency: true, compact: true })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Charts ────────────────────────────────────────── */}
            <MarketingCharts
                monthly={monthly}
                priorYears={priorYears}
                priorYearsTotals={priorYearsTotals}
                pipelineGap={pipelineGap}
            />
        </div>
    );
}
