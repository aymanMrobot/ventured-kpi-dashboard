import path from 'path';
import fs from 'fs';
import { cache } from 'react';

export interface MarketingMonthly {
    month: string;
    mqlTarget: number;
    mqlActual: number;
    sqlTarget: number;
    sqlActual: number;
    conversionRate: number;
    pipelineActual: number;
}

export interface MarketingYTD {
    mqlActual: number;
    mqlTarget: number;
    mqlAchievement: number;
    sqlActual: number;
    sqlTarget: number;
    sqlAchievement: number;
    pipelineActual: number;
    pipelineTarget: number;
    pipelineAchievement: number;
    conversionRate: number;
    avgSellingPrice: number;
}

export interface MarketingData {
    year: number;
    ytd: MarketingYTD;
    monthly: MarketingMonthly[];
}

/**
 * Load marketing data from the static JSON file.
 * Caches the result for the lifetime of the server.
 */
export const loadMarketingData = cache(async (): Promise<MarketingData> => {
    const filePath = path.join(process.cwd(), 'data', 'marketing.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as MarketingData;
});
