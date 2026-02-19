import { loadUKKpiData } from '@/lib/data/uk-kpi';
import Topbar from '@/components/topbar';
import CustomerMgmtCharts from './customer-management-charts';

export const dynamic = 'force-dynamic';

function fmt(n: number | null | undefined, opts?: { pct?: boolean }): string {
    if (n == null) return '—';
    if (opts?.pct) return `${(n * 100).toFixed(1)}%`;
    return n.toLocaleString();
}

function statusBorder(current: number, target: number): string {
    if (target === 0) return '#6B7280';
    const ratio = current / target;
    if (ratio >= 0.9) return '#22c55e';
    if (ratio >= 0.6) return '#f59e0b';
    return '#ef4444';
}

function statusTextCls(current: number, target: number): string {
    if (target === 0) return 'text-[var(--color-muted)]';
    const ratio = current / target;
    if (ratio >= 0.9) return 'text-emerald-500';
    if (ratio >= 0.6) return 'text-amber-500';
    return 'text-red-500';
}

export default async function CustomerManagementPage() {
    const data = await loadUKKpiData();
    const { customerMgmt } = data;

    return (
        <div className="flex flex-col gap-6">
            <Topbar title="Customer Management" subtitle="UK Support Operations & NPS · Weekly KPI Data" minDate="" maxDate="" />

            {/* ── Hero Badges ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    {
                        label: 'Inbound Cases',
                        value: fmt(customerMgmt.currentInboundCases),
                        sub: `Target: ${fmt(customerMgmt.inboundTarget)} · Stretch: ${fmt(customerMgmt.inboundStretch)}`,
                    },
                    {
                        label: '% Resolved in 24h',
                        value: fmt(customerMgmt.currentResolvedIn24h, { pct: true }),
                        sub: `Target: ${fmt(customerMgmt.resolvedTarget, { pct: true })}`,
                    },
                    {
                        label: 'NPS Participation',
                        value: fmt(customerMgmt.currentNPS, { pct: true }),
                        sub: 'Rolling NPS participation rate',
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
                        label: 'Customer Comms (1-to-Many)',
                        value: fmt(customerMgmt.currentCustomerComms),
                        current: customerMgmt.currentCustomerComms,
                        target: customerMgmt.commsTarget,
                        sub: `Target: ${fmt(customerMgmt.commsTarget)} · Stretch: ${fmt(customerMgmt.commsStretch)}`,
                    },
                    {
                        label: 'Converted Leads',
                        value: fmt(customerMgmt.currentConvertedLeads),
                        current: customerMgmt.currentConvertedLeads,
                        target: customerMgmt.convertedLeadsTarget,
                        sub: `Target: ${fmt(customerMgmt.convertedLeadsTarget)} · Stretch: ${fmt(customerMgmt.convertedLeadsStretch)}`,
                    },
                    {
                        label: 'Leads Generated',
                        value: fmt(customerMgmt.currentLeadsGenerated),
                        current: customerMgmt.currentLeadsGenerated,
                        target: 0,
                        sub: 'From customer management',
                    },
                    {
                        label: '% Resolved in 24h',
                        value: fmt(customerMgmt.currentResolvedIn24h, { pct: true }),
                        current: customerMgmt.currentResolvedIn24h,
                        target: customerMgmt.resolvedTarget,
                        sub: `Stretch: ${fmt(customerMgmt.resolvedStretch, { pct: true })}`,
                    },
                ].map((c) => (
                    <div
                        key={c.label}
                        className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4 border-l-[3px] transition-colors duration-300"
                        style={{ borderLeftColor: statusBorder(c.current, c.target) }}
                    >
                        <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{c.label}</p>
                        <p className="text-2xl font-bold mt-1.5">{c.value}</p>
                        <p className={`text-xs mt-1 ${statusTextCls(c.current, c.target)}`}>{c.sub}</p>
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
                                <th className="px-5 py-3 text-right font-medium">Inbound Cases</th>
                                <th className="px-5 py-3 text-right font-medium">Resolved 24h</th>
                                <th className="px-5 py-3 text-right font-medium">Comms</th>
                                <th className="px-5 py-3 text-right font-medium">Conv. Leads</th>
                                <th className="px-5 py-3 text-right font-medium">NPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerMgmt.inboundCases.map((m, i) => (
                                <tr key={m.month} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                    <td className="px-5 py-3 font-semibold">{m.month}</td>
                                    <td className="px-5 py-3 text-right">{fmt(m.value)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(customerMgmt.resolvedIn24h[i]?.value, { pct: true })}</td>
                                    <td className="px-5 py-3 text-right">{fmt(customerMgmt.customerComms[i]?.value)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(customerMgmt.convertedLeads[i]?.value)}</td>
                                    <td className="px-5 py-3 text-right">{fmt(customerMgmt.npsParticipation[i]?.value, { pct: true })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Charts ────────────────────────── */}
            <CustomerMgmtCharts customerMgmt={customerMgmt} />
        </div>
    );
}
