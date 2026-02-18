import path from 'path';
import fs from 'fs';
import { cache } from 'react';

/* ── Monthly row ─────────────────────────────────────────────── */
export interface MarketingMonthly {
    month: string;
    mqlTarget: number;
    mqlActual: number | null;
    mqlPct: number | null;
    sqlTarget: number;
    sqlActual: number | null;
    sqlPct: number | null;
    conversionRate: number | null;
    aspTarget: number;
    aspActual: number | null;
    pipelineTarget: number;
    pipelineActual: number | null;
    pipelinePct: number | null;
    marketingSalesTarget: number;
    marketingSalesActual: number | null;
}

/* ── Quarterly rollup ────────────────────────────────────────── */
export interface MarketingQuarterly {
    quarter: string;
    mqlTarget: number;
    mqlActual: number;
    mqlPct: number;
    sqlTarget: number;
    sqlActual: number;
    sqlPct: number;
    conversionRate: number | null;
    pipelineTarget: number;
    pipelineActual: number;
    pipelinePct: number;
    marketingSalesTarget: number;
}

/* ── YTD summary ─────────────────────────────────────────────── */
export interface MarketingYTD {
    mqlTarget: number;
    mqlActual: number;
    mqlAchievement: number;
    sqlTarget: number;
    sqlActual: number;
    sqlAchievement: number;
    conversionRate: number;
    aspTarget: number;
    aspActual: number;
    pipelineTarget: number;
    pipelineActual: number;
    pipelineAchievement: number;
    marketingSalesTarget: number;
    marketingSalesActual: number;
}

/* ── Prior‑year MQL comparison ───────────────────────────────── */
export interface PriorYearRow {
    month: string;
    mql2023: number;
    mql2024: number;
    mql2025: number;
    mql2026Target: number;
}

export interface PriorYearsTotals {
    mql2023: number;
    mql2024: number;
    mql2025: number;
    mql2026Target: number;
    yoyGrowth2024: number;
    yoyGrowth2025: number;
    yoyGrowth2026: number;
}

/* ── Year‑on‑Year row ────────────────────────────────────────── */
export interface YearOnYearRow {
    month: string;
    mql2025: number;
    mql2026: number;
    mqlYoY: number;
    pipeline2025: number;
    pipeline2026Target: number;
    pipelineYoY: number;
}

/* ── Pipeline gap (ELT) ──────────────────────────────────────── */
export interface PipelineGapRow {
    month: string;
    target: number;
    actual: number | null;
}

/* ── Top-level data shape ────────────────────────────────────── */
export interface MarketingData {
    year: number;
    ytd: MarketingYTD;
    monthly: MarketingMonthly[];
    quarterly: MarketingQuarterly[];
    priorYears: PriorYearRow[];
    priorYearsTotals: PriorYearsTotals;
    yearOnYear: YearOnYearRow[];
    pipelineGap: PipelineGapRow[];
}

/**
 * Load marketing data from the 2026 JSON file.
 * Cached for the lifetime of the server request.
 */
export const loadMarketingData = cache(async (): Promise<MarketingData> => {
    const filePath = path.join(process.cwd(), 'data', 'marketing-2026.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as MarketingData;
});
