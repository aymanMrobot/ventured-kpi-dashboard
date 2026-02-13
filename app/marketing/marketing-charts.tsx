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
import type { MarketingMonthly } from '@/lib/data/marketing';

interface MarketingChartsProps {
    monthly: MarketingMonthly[];
}

const tooltipStyle = {
    backgroundColor: '#111617',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
};

const axisTickStyle = { fill: 'var(--color-muted)', fontSize: '11px' };

export default function MarketingCharts({ monthly }: MarketingChartsProps) {
    const chartData = monthly.map((m) => ({
        month: m.month.substring(0, 3),
        mqlTarget: m.mqlTarget,
        mqlActual: m.mqlActual,
        sqlTarget: m.sqlTarget,
        sqlActual: m.sqlActual,
        conversionRate: m.conversionRate,
        pipeline: m.pipelineActual,
    }));

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* MQL Target vs Actual */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">MQL Target vs Actual</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <XAxis dataKey="month" tick={axisTickStyle} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                            <Bar dataKey="mqlTarget" name="Target" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                            <Bar dataKey="mqlActual" name="Actual" fill="var(--color-brand)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SQL Target vs Actual */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">SQL Target vs Actual</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <XAxis dataKey="month" tick={axisTickStyle} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                            <Bar dataKey="sqlTarget" name="Target" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                            <Bar dataKey="sqlActual" name="Actual" fill="#9b87f5" radius={[4, 4, 0, 0]} maxBarSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Conversion Rate Trend */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Conversion Rate Trend</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <XAxis dataKey="month" tick={axisTickStyle} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} unit="%" />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} formatter={(value: number) => [`${value}%`, 'Conversion Rate']} />
                            <Line type="monotone" dataKey="conversionRate" name="Conv. Rate" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#111617' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pipeline Value Trend */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Pipeline Value Trend</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <XAxis dataKey="month" tick={axisTickStyle} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} formatter={(value: number) => [`£${value.toLocaleString()}`, 'Pipeline']} />
                            <Line type="monotone" dataKey="pipeline" name="Pipeline" stroke="var(--color-brand)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#111617' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
