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
import type { UKFinanceData } from '@/lib/data/uk-kpi';

interface FinanceChartsProps {
    finance: UKFinanceData;
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

export default function FinanceCharts({ finance }: FinanceChartsProps) {
    const arData = finance.totalAgedAR.map((m, i) => ({
        month: m.month.substring(0, 3),
        totalAR: m.value,
        ar180: finance.ar180Plus[i]?.value,
        ar90: finance.ar90Plus[i]?.value,
    }));

    const arPctData = finance.ar180PlusPct.map((m, i) => ({
        month: m.month.substring(0, 3),
        pct180: m.value != null ? Math.round(m.value * 10000) / 100 : null,
        pct90: finance.ar90PlusPct[i]?.value != null ? Math.round(finance.ar90PlusPct[i].value! * 10000) / 100 : null,
    }));

    const billsData = finance.numBills.map((m, i) => ({
        month: m.month.substring(0, 3),
        numBills: m.value,
        netValue: finance.netBillValue[i]?.value,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Total Aged AR trend */}
            <ChartCard title="Total Aged AR — Monthly Trend">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={arData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1_000_000).toFixed(1)}M`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Area dataKey="totalAR" name="Total AR" fill="var(--color-brand)" fillOpacity={0.1} stroke="var(--color-brand)" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* AR Aging breakdown */}
            <ChartCard title="AR Aging — 90+ vs 180+ Days">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={arData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [`£${value?.toLocaleString() ?? '—'}`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar dataKey="ar90" name="90+ Days" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="ar180" name="180+ Days" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* AR % of total trends */}
            <ChartCard title="AR Aging — % of Total Outstanding">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={arPctData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--chart-grid)' }} formatter={(value: number) => [`${value}%`, undefined]} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Line type="monotone" dataKey="pct90" name="90+ % of Total" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#f59e0b', strokeWidth: 2 }} connectNulls={false} />
                        <Line type="monotone" dataKey="pct180" name="180+ % of Total" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#ef4444', strokeWidth: 2 }} connectNulls={false} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* Bills volume & value */}
            <ChartCard title="Billing — Volume & Net Value">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={billsData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={axisTickStyle} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1_000_000).toFixed(1)}M`} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                        <Bar yAxisId="left" dataKey="numBills" name="Number of Bills" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Line yAxisId="right" type="monotone" dataKey="netValue" name="Net Value" stroke="#9b87f5" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-surface)', stroke: '#9b87f5', strokeWidth: 2 }} connectNulls={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}
