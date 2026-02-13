import { loadMarketingData } from '@/lib/data/marketing';
import Topbar from '@/components/topbar';
import KpiCard from '@/components/kpi-card';
import MarketingCharts from './marketing-charts';

export const dynamic = 'force-dynamic';

export default async function MarketingPage() {
    const data = await loadMarketingData();
    const { ytd, monthly } = data;

    return (
        <div className="flex flex-col gap-6">
            <Topbar title="Marketing" subtitle="Demand generation performance" minDate="" maxDate="" />

            {/* YTD Achievement Badges */}
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #0aa8b7 0%, #078a96 100%)' }}>
                    <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">YTD MQL Achievement</p>
                    <p className="text-2xl font-bold text-white mt-1">{ytd.mqlAchievement}%</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #0aa8b7 0%, #078a96 100%)' }}>
                    <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">YTD SQL Achievement</p>
                    <p className="text-2xl font-bold text-white mt-1">{ytd.sqlAchievement}%</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #0aa8b7 0%, #078a96 100%)' }}>
                    <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Pipeline Value</p>
                    <p className="text-2xl font-bold text-white mt-1">£{(ytd.pipelineActual / 1000000).toFixed(2)}M</p>
                </div>
            </div>

            {/* KPI Cards with colored left borders */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4 border-l-[3px]" style={{ borderLeftColor: '#22c55e' }}>
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">MQL Achievement</p>
                    <p className="text-2xl font-bold mt-1.5">{ytd.mqlActual.toLocaleString()}</p>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        {ytd.mqlAchievement}% of target
                    </p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4 border-l-[3px]" style={{ borderLeftColor: '#f59e0b' }}>
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">SQL Achievement</p>
                    <p className="text-2xl font-bold mt-1.5">{ytd.sqlActual.toLocaleString()}</p>
                    <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                        {ytd.sqlAchievement}% of target
                    </p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4 border-l-[3px]" style={{ borderLeftColor: '#22c55e' }}>
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Opportunity Value</p>
                    <p className="text-2xl font-bold mt-1.5">£{(ytd.pipelineActual / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        {ytd.pipelineAchievement}% of target
                    </p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4 border-l-[3px]" style={{ borderLeftColor: '#22c55e' }}>
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Conversion Rate</p>
                    <p className="text-2xl font-bold mt-1.5">{ytd.conversionRate}%</p>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        MQL → SQL
                    </p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4 border-l-[3px]" style={{ borderLeftColor: '#22c55e' }}>
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Avg Selling Price</p>
                    <p className="text-2xl font-bold mt-1.5">£{ytd.avgSellingPrice.toLocaleString()}</p>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Per opportunity
                    </p>
                </div>
            </div>

            {/* Target vs Actual Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4">
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">MQL Actual</p>
                    <p className="text-xl font-bold text-brand mt-1.5">{ytd.mqlActual.toLocaleString()}</p>
                    <p className="text-xs text-muted mt-1">Target: {ytd.mqlTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4">
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">SQL Actual</p>
                    <p className="text-xl font-bold text-brand mt-1.5">{ytd.sqlActual.toLocaleString()}</p>
                    <p className="text-xs text-muted mt-1">Target: {ytd.sqlTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4">
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Pipeline Value</p>
                    <p className="text-xl font-bold text-brand mt-1.5">£{ytd.pipelineActual.toLocaleString()}</p>
                    <p className="text-xs text-muted mt-1">Target: £{ytd.pipelineTarget.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-surface border border-white/[0.06] p-4">
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Conversion Rate</p>
                    <p className="text-xl font-bold text-brand mt-1.5">{ytd.conversionRate}%</p>
                    <p className="text-xs text-muted mt-1">MQL → SQL</p>
                </div>
            </div>

            {/* Charts */}
            <MarketingCharts monthly={monthly} />
        </div>
    );
}
