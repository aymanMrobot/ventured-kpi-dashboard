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
import type { MarketingMonthly, YearOnYearRow } from '@/lib/data/marketing';

interface SalesChartsProps {
    monthly: MarketingMonthly[];
    yearOnYear: YearOnYearRow[];
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

export default function SalesCharts({ monthly, yearOnYear }: SalesChartsProps) {
    const monthlyData = monthly.map((m) => ({
        month: m.month.substring(0, 3),
        pipelineTarget: m.pipelineTarget,
        pipelineActual: m.pipelineActual,
        salesTarget: m.marketingSalesTarget,
        salesActual: m.marketingSalesActual,
        aspTarget: m.aspTarget,
        aspActual: m.aspActual,
    }));

    const yoyData = yearOnYear.map((y) => ({
        month: y.month.substring(0, 3),
        'Pipeline 2025': y.pipeline2025,
        'Pipeline 2026 Target': y.pipeline2026Target,
        pipelineYoY: y.pipelineYoY,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* ── Monthly Pipeline Target vs Actual ──── */}
            <ChartCard title="Monthly Pipeline — Target vs Actual">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Area dataKey="pipelineTarget" name="Target" fill="var(--color-brand)" fillOpacity={0.08} stroke="var(--color-brand)" strokeWidth={1.5} strokeDasharray="5 3" />
                        <Bar dataKey="pipelineActual" name="Actual" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Monthly Sales Target ──── */}
            <ChartCard title="Monthly Marketing Sales Target">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="salesTarget" name="Sales Target" fill="#9b87f5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="salesActual" name="Sales Actual" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── ASP Trend ──── */}
            <ChartCard title="Average Selling Price — Target vs Actual">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${v.toLocaleString()}`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Line
                            type="monotone"
                            dataKey="aspTarget"
                            name="ASP Target"
                            stroke="var(--color-muted)"
                            strokeWidth={1.5}
                            strokeDasharray="5 3"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="aspActual"
                            name="ASP Actual"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#f59e0b', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Pipeline YoY Comparison ──── */}
            <ChartCard title="Pipeline — Year-on-Year (2025 vs 2026)">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yoyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="Pipeline 2025" fill="var(--color-muted)" opacity={0.4} radius={[4, 4, 0, 0]} maxBarSize={24} />
                        <Bar dataKey="Pipeline 2026 Target" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}
