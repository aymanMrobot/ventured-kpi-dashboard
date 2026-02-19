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
import type { UKCustomerMgmtData } from '@/lib/data/uk-kpi';

interface CustomerMgmtChartsProps {
    customerMgmt: UKCustomerMgmtData;
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

export default function CustomerMgmtCharts({ customerMgmt }: CustomerMgmtChartsProps) {
    const monthlyData = customerMgmt.inboundCases.map((m, i) => ({
        month: m.month.substring(0, 3),
        inbound: m.value,
        resolved24h: customerMgmt.resolvedIn24h[i]?.value != null ? Math.round(customerMgmt.resolvedIn24h[i].value! * 100) : null,
        comms: customerMgmt.customerComms[i]?.value,
        convertedLeads: customerMgmt.convertedLeads[i]?.value,
        nps: customerMgmt.npsParticipation[i]?.value != null ? Math.round(customerMgmt.npsParticipation[i].value! * 10000) / 100 : null,
        leadsGenerated: customerMgmt.leadsGenerated[i]?.value,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Inbound Cases */}
            <ChartCard title="Inbound Cases — Monthly Volume">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Area dataKey="inbound" name="Inbound Cases" fill="var(--color-brand)" fillOpacity={0.1} stroke="var(--color-brand)" strokeWidth={2} />
                        <Bar dataKey="inbound" name="Inbound Cases" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Resolution Rate */}
            <ChartCard title="% Cases Resolved in 24 Hours">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} formatter={(value: number) => [`${value}%`, '% in 24h']} />
                        <Line
                            type="monotone"
                            dataKey="resolved24h"
                            name="Resolved in 24h"
                            stroke="#22c55e"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#22c55e', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Customer Comms & Leads */}
            <ChartCard title="Customer Comms & Converted Leads">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="comms" name="Customer Comms" fill="#9b87f5" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="convertedLeads" name="Converted Leads" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* NPS Participation */}
            <ChartCard title="NPS Participation Rate">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} formatter={(value: number) => [`${value}%`, 'NPS Participation']} />
                        <Line
                            type="monotone"
                            dataKey="nps"
                            name="NPS %"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#f59e0b', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2, fill: 'var(--color-surface)' }}
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}
