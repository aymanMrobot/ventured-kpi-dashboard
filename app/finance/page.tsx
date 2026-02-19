import { loadUKKpiData } from '@/lib/data/uk-kpi';
import Topbar from '@/components/topbar';
import FinanceCharts from './finance-charts';

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

function statusColor(pct: number, target: number, inverse = false): string {
    const ratio = inverse ? target / Math.max(pct, 0.001) : pct / Math.max(target, 0.001);
    if (ratio <= (inverse ? 1 : 0.6)) return inverse ? '#22c55e' : '#ef4444';
    if (ratio <= (inverse ? 1.5 : 0.9)) return '#f59e0b';
    return inverse ? '#ef4444' : '#22c55e';
}

export default async function FinancePage() {
    const data = await loadUKKpiData();
    const { finance } = data;

    return (
        <div className="flex flex-col gap-6">
            <Topbar title="Finance" subtitle="UK Accounts Receivable & Billing · Weekly KPI Data" minDate="" maxDate="" />

            {/* ── Hero Badges ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: 'Total Aged AR',
                        value: fmt(finance.currentTotalAR, { currency: true, compact: true }),
                        sub: 'Current total outstanding',
                    },
                    {
                        label: 'Number of Bills',
                        value: fmt(finance.currentNumBills),
                        sub: `Net value: ${fmt(finance.currentNetBillValue, { currency: true, compact: true })}`,
                    },
                    {
                        label: 'Net Bill Value',
                        value: fmt(finance.currentNetBillValue, { currency: true, compact: true }),
                        sub: 'Current billing period',
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

            {/* ── AR Aging Cards ─────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: '180+ Days AR',
                        value: fmt(finance.current180Plus, { currency: true, compact: true }),
                        pctValue: fmt(finance.current180PlusPct, { pct: true }),
                        color: statusColor(finance.current180PlusPct, finance.ar180PctTarget, true),
                        sub: `Target: <${fmt(finance.ar180PctTarget, { pct: true })}`,
                    },
                    {
                        label: '90+ Days AR',
                        value: fmt(finance.current90Plus, { currency: true, compact: true }),
                        pctValue: fmt(finance.current90PlusPct, { pct: true }),
                        color: statusColor(finance.current90PlusPct, finance.ar90PctTarget, true),
                        sub: `Target: <${fmt(finance.ar90PctTarget, { pct: true })}`,
                    },
                    {
                        label: '180+ AR % of Total',
                        value: fmt(finance.current180PlusPct, { pct: true }),
                        pctValue: null,
                        color: statusColor(finance.current180PlusPct, finance.ar180PctTarget, true),
                        sub: `Stretch: <${fmt(finance.ar180PctStretch, { pct: true })}`,
                    },
                    {
                        label: '90+ AR % of Total',
                        value: fmt(finance.current90PlusPct, { pct: true }),
                        pctValue: null,
                        color: statusColor(finance.current90PlusPct, finance.ar90PctTarget, true),
                        sub: `Stretch: <${fmt(finance.ar90PctStretch, { pct: true })}`,
                    },
                ].map((c) => (
                    <div
                        key={c.label}
                        className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 border-l-[3px] transition-colors duration-300"
                        style={{ borderLeftColor: c.color }}
                    >
                        <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{c.label}</p>
                        <p className="text-2xl font-bold mt-1.5">{c.value}</p>
                        {c.pctValue && <p className="text-sm font-semibold mt-0.5" style={{ color: c.color }}>{c.pctValue} of total</p>}
                        <p className="text-xs text-[var(--color-muted)] mt-1">{c.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Charts ────────────────────────── */}
            <FinanceCharts finance={finance} />
        </div>
    );
}
