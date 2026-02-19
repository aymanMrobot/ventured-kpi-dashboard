'use client';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Area,
    ComposedChart,
} from 'recharts';
import type { UKProductData } from '@/lib/data/uk-kpi';

interface ProductChartsProps {
    product: UKProductData;
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

export default function ProductCharts({ product }: ProductChartsProps) {
    const mauData = product.appUsageMAU
        .filter((m) => m.value != null)
        .map((m) => ({
            month: m.month.substring(0, 3),
            mau: m.value,
        }));

    return (
        <div className="grid gap-6">
            <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 transition-colors duration-300">
                <h2 className="text-base font-semibold mb-4">App Usage (MAU) — Monthly Trend</h2>
                <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={mauData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--color-border-subtle)' }} formatter={(value: number) => [value?.toLocaleString() ?? '—', 'MAU']} />
                            <Area dataKey="mau" name="MAU" fill="var(--color-brand)" fillOpacity={0.12} stroke="var(--color-brand)" strokeWidth={2.5} />
                            <Line
                                type="monotone"
                                dataKey="mau"
                                name="MAU"
                                stroke="var(--color-brand)"
                                strokeWidth={2.5}
                                dot={{ r: 5, fill: 'var(--color-surface)', stroke: 'var(--color-brand)', strokeWidth: 2.5 }}
                                activeDot={{ r: 7, strokeWidth: 2.5, fill: 'var(--color-surface)' }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
