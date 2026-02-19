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
import type { UKSalesData, UKCrossSellData } from '@/lib/data/uk-kpi';

interface SalesChartsProps {
    sales: UKSalesData;
    crossSell: UKCrossSellData;
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

export default function SalesCharts({ sales, crossSell }: SalesChartsProps) {
    // Pipeline breakdown data
    const pipelineData = sales.totalPipelineGen.map((m, i) => ({
        month: m.month.substring(0, 3),
        total: m.value,
        sales: sales.salesPipelineGen[i]?.value,
        marketing: sales.marketingPipelineGen[i]?.value,
        internal: sales.internalPipelineGen[i]?.value,
    }));

    // Win rate & ASP trend
    const performanceData = sales.winRate.map((m, i) => ({
        month: m.month.substring(0, 3),
        winRate: m.value != null ? Math.round(m.value * 100) : null,
        asp: sales.closedWonASP[i]?.value,
    }));

    // Bookings vs objective
    const bookingsData = sales.bookingsClosedWon.map((m, i) => ({
        month: m.month.substring(0, 3),
        closedWon: m.value,
        forecast: sales.salesForecast[i]?.value,
        objective: sales.salesObjective[i]?.value,
    }));

    // Cross-sell data
    const crossSellData = crossSell.oppsCreated.map((m, i) => ({
        month: m.month.substring(0, 3),
        oppsCreated: m.value,
        closedWon: crossSell.closedWon[i]?.value,
        pipelineValue: crossSell.currentPipelineValue[i]?.value,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Pipeline breakdown */}
            <ChartCard title="Pipeline Generation — Breakdown by Source">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="sales" name="Sales" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={20} stackId="pipeline" />
                        <Bar dataKey="marketing" name="Marketing" fill="#9b87f5" radius={[0, 0, 0, 0]} maxBarSize={20} stackId="pipeline" />
                        <Bar dataKey="internal" name="Internal" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={20} stackId="pipeline" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Bookings vs Objective */}
            <ChartCard title="Bookings Closed Won vs Objective">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={bookingsData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Area dataKey="objective" name="Objective" fill="var(--color-brand)" fillOpacity={0.08} stroke="var(--color-brand)" strokeWidth={1.5} strokeDasharray="5 3" />
                        <Bar dataKey="closedWon" name="Closed Won" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Win Rate Trend */}
            <ChartCard title="Win Rate Trend (MTD %)">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} formatter={(value: number) => [`${value}%`, 'Win Rate']} />
                        <Line
                            type="monotone"
                            dataKey="winRate"
                            name="Win Rate"
                            stroke="#22c55e"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#22c55e', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ASP Trend */}
            <ChartCard title="Average Selling Price (Closed Won)">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${v.toLocaleString()}`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Line
                            type="monotone"
                            dataKey="asp"
                            name="Avg Selling Price"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#f59e0b', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Cross-Sell Pipeline & Won */}
            <ChartCard title="Cross-Sell — Opportunities Created vs Won">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crossSellData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="oppsCreated" name="Opps Created" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="closedWon" name="Closed Won" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Cross-Sell Pipeline Value */}
            <ChartCard title="Cross-Sell — Monthly Pipeline Value">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={crossSellData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Area dataKey="pipelineValue" name="Pipeline Value" fill="#9b87f5" fillOpacity={0.15} stroke="#9b87f5" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}
