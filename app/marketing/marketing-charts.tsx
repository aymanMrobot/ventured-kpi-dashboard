'use client';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ComposedChart,
    Area,
} from 'recharts';
import type {
    MarketingMonthly,
    PriorYearRow,
    PriorYearsTotals,
    PipelineGapRow,
} from '@/lib/data/marketing';

interface MarketingChartsProps {
    monthly: MarketingMonthly[];
    priorYears: PriorYearRow[];
    priorYearsTotals: PriorYearsTotals;
    pipelineGap: PipelineGapRow[];
}

const tooltipStyle = {
    backgroundColor: 'var(--tooltip-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    color: 'var(--color-text)',
};

const axisTickStyle = { fill: 'var(--color-muted)', fontSize: '11px' };
const gridProps = { stroke: 'var(--chart-grid)', strokeDasharray: '3 3' };

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 transition-colors duration-300">
            <h2 className="text-base font-semibold mb-4">{title}</h2>
            <div className="h-[300px]">{children}</div>
        </div>
    );
}

export default function MarketingCharts({
    monthly,
    priorYears,
    priorYearsTotals,
    pipelineGap,
}: MarketingChartsProps) {
    const monthlyData = monthly.map((m) => ({
        month: m.month.substring(0, 3),
        mqlTarget: m.mqlTarget,
        mqlActual: m.mqlActual,
        sqlTarget: m.sqlTarget,
        sqlActual: m.sqlActual,
        conversionRate: m.conversionRate,
        pipelineTarget: m.pipelineTarget,
        pipelineActual: m.pipelineActual,
        aspTarget: m.aspTarget,
        aspActual: m.aspActual,
    }));

    const priorData = priorYears.map((p) => ({
        month: p.month.substring(0, 3),
        '2023': p.mql2023,
        '2024': p.mql2024,
        '2025': p.mql2025,
        '2026 Target': p.mql2026Target,
    }));

    const pipelineData = pipelineGap.map((p) => ({
        month: p.month.substring(0, 3),
        target: p.target,
        actual: p.actual,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* ── MQL Target vs Actual ──── */}
            <ChartCard title="MQL — Target vs Actual">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="mqlTarget" name="Target" fill="var(--color-muted)" opacity={0.3} radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="mqlActual" name="Actual" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── SQL Target vs Actual ──── */}
            <ChartCard title="SQL — Target vs Actual">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="sqlTarget" name="Target" fill="var(--color-muted)" opacity={0.3} radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="sqlActual" name="Actual" fill="#9b87f5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Pipeline Target vs Actual ──── */}
            <ChartCard title="Pipeline — Target vs Actual (FYV)">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={pipelineData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value.toLocaleString()}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Area dataKey="target" name="Target" fill="var(--color-brand)" fillOpacity={0.08} stroke="var(--color-brand)" strokeWidth={1.5} strokeDasharray="5 3" />
                        <Bar dataKey="actual" name="Actual" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Conversion Rate Trend ──── */}
            <ChartCard title="MQL → SQL Conversion Rate">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip
                            contentStyle={tooltipStyle}
                            cursor={{ stroke: 'var(--chart-grid)' }}
                            formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                        />
                        <Line
                            type="monotone"
                            dataKey="conversionRate"
                            name="Conv. Rate"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#f59e0b', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── YoY MQL Growth (4 years) ──── */}
            <ChartCard title="MQL Year-on-Year Trend (2023–2026)">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priorData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Line type="monotone" dataKey="2023" stroke="#6b7280" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
                        <Line type="monotone" dataKey="2024" stroke="#9b87f5" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
                        <Line type="monotone" dataKey="2025" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="2026 Target" stroke="var(--color-brand)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-brand)' }} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── YoY Growth Summary ──── */}
            <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 transition-colors duration-300">
                <h2 className="text-base font-semibold mb-4">Year-on-Year MQL Growth</h2>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { year: '2023→2024', growth: priorYearsTotals.yoyGrowth2024, total: priorYearsTotals.mql2024 },
                        { year: '2024→2025', growth: priorYearsTotals.yoyGrowth2025, total: priorYearsTotals.mql2025 },
                        { year: '2025→2026', growth: priorYearsTotals.yoyGrowth2026, total: priorYearsTotals.mql2026Target },
                    ].map((item) => (
                        <div key={item.year} className="text-center p-4 rounded-lg bg-[var(--color-surface-elevated)] transition-colors duration-300">
                            <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">{item.year}</p>
                            <p className="text-2xl font-bold text-emerald-500 mt-1">+{item.growth}%</p>
                            <p className="text-xs text-[var(--color-muted)] mt-1">{item.total.toLocaleString()} MQLs</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
