import { loadUKKpiData } from '@/lib/data/uk-kpi';
import Topbar from '@/components/topbar';
import ProductCharts from './product-charts';

export const dynamic = 'force-dynamic';

function fmt(n: number | null | undefined, opts?: { compact?: boolean }): string {
    if (n == null) return '—';
    if (opts?.compact) {
        if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
        if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    }
    return n.toLocaleString();
}

export default async function ProductPage() {
    const data = await loadUKKpiData();
    const { product } = data;

    // Find last non-null value for trend indicator
    const nonNull = product.appUsageMAU.filter((m) => m.value != null);
    const prevValue = nonNull.length >= 2 ? nonNull[nonNull.length - 2].value : null;
    const trendPct = prevValue && product.currentMAU ? Math.round(((product.currentMAU - prevValue) / prevValue) * 100) : null;

    return (
        <div className="flex flex-col gap-6">
            <Topbar title="Product" subtitle="UK App Usage & Adoption · Monthly Active Users" minDate="" maxDate="" />

            {/* ── Hero Badge ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    className="rounded-xl p-5 text-center sm:col-span-2"
                    style={{ background: 'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand) 100%)' }}
                >
                    <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">App Usage (MAU — 30 Day Rolling)</p>
                    <p className="text-4xl font-bold text-white mt-1">{fmt(product.currentMAU, { compact: true })}</p>
                    {trendPct != null && (
                        <p className={`text-sm font-semibold mt-2 ${trendPct >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct)}% vs previous month
                        </p>
                    )}
                </div>

                <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 flex flex-col items-center justify-center transition-colors duration-300">
                    <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">Months Tracked</p>
                    <p className="text-3xl font-bold mt-1">{nonNull.length}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-1">Data points available</p>
                </div>
            </div>

            {/* ── Monthly Stats ──────────────────── */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden transition-colors duration-300">
                <div className="px-5 py-4 border-b border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold">Monthly Active Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                                <th className="px-5 py-3 text-left font-medium">Month</th>
                                <th className="px-5 py-3 text-right font-medium">MAU</th>
                                <th className="px-5 py-3 text-right font-medium">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.appUsageMAU.filter((m) => m.value != null).map((m, i, arr) => {
                                const prev = i > 0 ? arr[i - 1]?.value : null;
                                const change = prev && m.value ? Math.round(((m.value - prev) / prev) * 100) : null;
                                return (
                                    <tr key={m.month} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                                        <td className="px-5 py-3 font-semibold">{m.month}</td>
                                        <td className="px-5 py-3 text-right">{fmt(m.value)}</td>
                                        <td className={`px-5 py-3 text-right font-semibold ${change == null ? 'text-[var(--color-muted)]' : change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {change != null ? `${change >= 0 ? '+' : ''}${change}%` : '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Charts ────────────────────────── */}
            <ProductCharts product={product} />
        </div>
    );
}
