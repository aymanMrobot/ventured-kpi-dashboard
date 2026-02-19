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
} from 'recharts';
import type { UKRetentionData } from '@/lib/data/uk-kpi';

interface RetentionChartsProps {
    retention: UKRetentionData;
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

export default function RetentionCharts({ retention }: RetentionChartsProps) {
    const monthlyData = retention.proactiveCases.map((m, i) => ({
        month: m.month.substring(0, 3),
        proactiveCases: m.value,
        highValueComms: retention.highValueCommsEngaged[i]?.value,
        convertedLeads: retention.convertedLeads[i]?.value,
        crossSellLeads: retention.crossSellLeads[i]?.value,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Proactive Cases */}
            <ChartCard title="Proactive Cases — Monthly Trend">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Bar dataKey="proactiveCases" name="Proactive Cases" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* High Value Comms */}
            <ChartCard title="High-Value Comms Engagement">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} />
                        <Line
                            type="monotone"
                            dataKey="highValueComms"
                            name="HV Comms"
                            stroke="#9b87f5"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#9b87f5', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Leads */}
            <ChartCard title="Converted & Cross-Sell Leads">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="convertedLeads" name="Converted Leads" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="crossSellLeads" name="Cross-Sell Leads" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Combined Performance */}
            <ChartCard title="Overall Retention Activity">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Line type="monotone" dataKey="proactiveCases" name="Proactive Cases" stroke="var(--color-brand)" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="highValueComms" name="HV Comms" stroke="#9b87f5" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="convertedLeads" name="Conv. Leads" stroke="#22c55e" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="crossSellLeads" name="X-Sell Leads" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}
