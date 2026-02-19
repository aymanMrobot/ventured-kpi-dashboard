import { loadUKKpiData } from '@/lib/data/uk-kpi';
import Topbar from '@/components/topbar';
import RetentionCharts from './retention-charts';

export const dynamic = 'force-dynamic';

function fmt(n: number | null | undefined, opts?: { pct?: boolean }): string {
    if (n == null) return '—';
    if (opts?.pct) return `${(n * 100).toFixed(1)}%`;
    return n.toLocaleString();
}

function statusBorder(current: number, target: number): string {
    const ratio = target > 0 ? current / target : 0;
    if (ratio >= 0.9) return '#22c55e';
    if (ratio >= 0.6) return '#f59e0b';
    return '#ef4444';
}

function statusTextCls(current: number, target: number): string {
    const ratio = target > 0 ? current / target : 0;
    if (ratio >= 0.9) return 'text-emerald-500';
    if (ratio >= 0.6) return 'text-amber-500';
    return 'text-red-500';
}

export default async function RetentionPage() {
    const data = await loadUKKpiData();
    const { retention } = data;

    const cards = [
        {
            label: 'Proactive Cases (Weekly)',
            value: fmt(retention.currentProactiveCases),
            target: retention.proactiveCasesTarget,
            stretch: retention.proactiveCasesStretch,
            current: retention.currentProactiveCases,
        },
        {
            label: 'High-Value Comms Engaged',
            value: fmt(retention.currentHighValueComms),
            target: retention.highValueCommsTarget,
            stretch: retention.highValueCommsStretch,
            current: retention.currentHighValueComms,
        },
        {
            label: 'Converted Leads',
            value: fmt(retention.currentConvertedLeads),
            target: retention.convertedLeadsTarget,
            stretch: retention.convertedLeadsStretch,
            current: retention.currentConvertedLeads,
        },
        {
            label: 'Cross-Sell Leads',
            value: fmt(retention.currentCrossSellLeads),
            target: retention.crossSellLeadsTarget,
            stretch: retention.crossSellLeadsStretch,
            current: retention.currentCrossSellLeads,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <Topbar title="Retention" subtitle="UK Customer Retention & Engagement · Weekly KPI Data" minDate="" maxDate="" />

            {/* ── Hero Badges ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c) => (
                    <div
                        key={c.label}
                        className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 border-l-[3px] transition-colors duration-300"
                        style={{ borderLeftColor: statusBorder(c.current, c.target) }}
                    >
                        <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{c.label}</p>
                        <p className="text-3xl font-bold mt-1.5">{c.value}</p>
                        <p className={`text-xs mt-1 ${statusTextCls(c.current, c.target)}`}>
                            Target: {fmt(c.target)} · Stretch: {fmt(c.stretch)}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Monthly Trend Table ─────────── */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden transition-colors duration-300">
                <div className="px-5 py-4 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold">Monthly Performance</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                                <th className="px-5 py-3 text-left font-medium">Month</th>
                                <th className="px-5 py-3 text-right font-medium">Proactive Cases</th>
                                <th className="px-5 py-3 text-right font-medium">HV Comms</th>
                                <th className="px-5 py-3 text-right font-medium">Conv. Leads</th>
                                <th className="px-5 py-3 text-right font-medium">Cross-Sell</th>
                            </tr>
                        </thead>
                        <tbody>
                            {retention.proactiveCases.map((m, i) => (
                                <tr key={m.month} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                    <td className="px-5 py-3 font-semibold">{m.month}</td>
                                    <td className="px-5 py-3 text-right">{fmt(m.value)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(retention.highValueCommsEngaged[i]?.value)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(retention.convertedLeads[i]?.value)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(retention.crossSellLeads[i]?.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Charts ────────────────────────── */}
            <RetentionCharts retention={retention} />
        </div>
    );
}
