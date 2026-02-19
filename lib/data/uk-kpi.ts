import path from 'path';
import fs from 'fs';
import * as xlsx from 'xlsx';
import { cache } from 'react';

/* ═══════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

/** Monthly data point for a single metric */
export interface MonthlyValue {
    month: string;
    value: number | null;
}

/* ── Sales ─────────────────────────────────────────────────── */
export interface UKSalesData {
    /* Pipeline generation */
    totalPipelineGen: MonthlyValue[];
    salesPipelineGen: MonthlyValue[];
    marketingPipelineGen: MonthlyValue[];
    internalPipelineGen: MonthlyValue[];
    /* Current month snapshot */
    currentMonthPipeline: number;
    currentQuarterOpenPipeline: number;
    /* Bookings */
    bookingsClosedWon: MonthlyValue[];
    bookingsVsObjective: MonthlyValue[];
    oppsClosedWon: MonthlyValue[];
    closedWonASP: MonthlyValue[];
    /* Win rate & forecast */
    winRate: MonthlyValue[];
    salesForecast: MonthlyValue[];
    salesObjective: MonthlyValue[];
    forecastVsObjectivePct: MonthlyValue[];
    /* Current-week / current-month summary values */
    currentWeekTotalPipeline: number;
    currentWeekSalesPipeline: number;
    currentWeekBookings: number;
    currentWeekWinRate: number;
    currentWeekASP: number;
    currentWeekForecast: number;
    currentWeekObjective: number;
    currentWeekForecastPct: number;
    /* Targets */
    pipelineWeeklyTarget: number;
    pipelineMonthlyTarget: number;
    aspTarget: number;
    aspStretch: number;
    winRateTarget: number;
    winRateStretch: number;
}

/* ── Cross Sell ────────────────────────────────────────────── */
export interface UKCrossSellData {
    dailySalesActivity: MonthlyValue[];
    oppsCreated: MonthlyValue[];
    currentPipelineValue: MonthlyValue[];
    closedWon: MonthlyValue[];
    closedWonForecast: MonthlyValue[];
    currentActivity: number;
    currentOppsCreated: number;
    activityTarget: number;
    oppsTarget: number;
    closedWonTarget: number;
    closedWonStretch: number;
}

/* ── Retention ─────────────────────────────────────────────── */
export interface UKRetentionData {
    proactiveCases: MonthlyValue[];
    highValueCommsEngaged: MonthlyValue[];
    highValueCommsApp: MonthlyValue[];
    convertedLeads: MonthlyValue[];
    crossSellLeads: MonthlyValue[];
    currentProactiveCases: number;
    currentHighValueComms: number;
    currentConvertedLeads: number;
    currentCrossSellLeads: number;
    proactiveCasesTarget: number;
    proactiveCasesStretch: number;
    highValueCommsTarget: number;
    highValueCommsStretch: number;
    convertedLeadsTarget: number;
    convertedLeadsStretch: number;
    crossSellLeadsTarget: number;
    crossSellLeadsStretch: number;
}

/* ── Customer Management ──────────────────────────────────── */
export interface UKCustomerMgmtData {
    inboundCases: MonthlyValue[];
    resolvedIn24h: MonthlyValue[];
    customerComms: MonthlyValue[];
    convertedLeads: MonthlyValue[];
    npsParticipation: MonthlyValue[];
    leadsGenerated: MonthlyValue[];
    currentInboundCases: number;
    currentResolvedIn24h: number;
    currentCustomerComms: number;
    currentConvertedLeads: number;
    currentNPS: number;
    currentLeadsGenerated: number;
    inboundTarget: number;
    inboundStretch: number;
    resolvedTarget: number;
    resolvedStretch: number;
    commsTarget: number;
    commsStretch: number;
    convertedLeadsTarget: number;
    convertedLeadsStretch: number;
}

/* ── Finance ──────────────────────────────────────────────── */
export interface UKFinanceData {
    totalAgedAR: MonthlyValue[];
    ar180Plus: MonthlyValue[];
    ar180PlusPct: MonthlyValue[];
    ar90Plus: MonthlyValue[];
    ar90PlusPct: MonthlyValue[];
    numBills: MonthlyValue[];
    netBillValue: MonthlyValue[];
    currentTotalAR: number;
    current180Plus: number;
    current180PlusPct: number;
    current90Plus: number;
    current90PlusPct: number;
    currentNumBills: number;
    currentNetBillValue: number;
    ar180PctTarget: number;
    ar180PctStretch: number;
    ar90PctTarget: number;
    ar90PctStretch: number;
}

/* ── Product ──────────────────────────────────────────────── */
export interface UKProductData {
    appUsageMAU: MonthlyValue[];
    currentMAU: number;
}

/* ── Top level ────────────────────────────────────────────── */
export interface UKKpiData {
    sales: UKSalesData;
    crossSell: UKCrossSellData;
    retention: UKRetentionData;
    customerMgmt: UKCustomerMgmtData;
    finance: UKFinanceData;
    product: UKProductData;
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

const MONTH_LABELS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// Month columns in the spreadsheet: C=Jan(25), D=Feb(25), E=Mar(25) ... N=Dec(25)
// Then P=Wk1(26), Q=Wk2(26), etc. — current month/weeks
const MONTHLY_COLS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // C through N (cols 3-14)

function num(val: unknown): number | null {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') return val;
    const s = String(val).replace(/[£$,%\s]/g, '');
    if (s === '' || s === '#DIV/0!' || s === 'N/A' || s === '-') return null;
    const n = Number(s);
    return isNaN(n) ? null : n;
}

function numOrZero(val: unknown): number {
    const n = num(val);
    return n ?? 0;
}

function getCell(ws: xlsx.WorkSheet, row: number, col: number): unknown {
    const addr = xlsx.utils.encode_cell({ r: row - 1, c: col - 1 });
    const cell = ws[addr];
    if (!cell) return null;
    // Skip Excel error cells (#DIV/0!, #N/A, #REF!, etc.) — xlsx stores them with type 'e'
    if (cell.t === 'e') return null;
    return cell.v;
}

function getMonthlyValues(ws: xlsx.WorkSheet, row: number): MonthlyValue[] {
    return MONTHLY_COLS.map((col, idx) => ({
        month: MONTH_LABELS[idx],
        value: num(getCell(ws, row, col)),
    }));
}

// Get "current" value — average of P and Q columns (current weeks) or just the latest non-null
function getCurrentValue(ws: xlsx.WorkSheet, row: number): number {
    const p = num(getCell(ws, row, 16)); // P column
    const q = num(getCell(ws, row, 17)); // Q column
    const u = num(getCell(ws, row, 21)); // U column (often the average/total)
    if (u !== null) return u;
    if (p !== null && q !== null) return (p + q) / 2;
    if (p !== null) return p;
    if (q !== null) return q;
    // Fallback: return the last non-null monthly value
    return getLastMonthlyValue(ws, row);
}

function getLastMonthlyValue(ws: xlsx.WorkSheet, row: number): number {
    for (let i = MONTHLY_COLS.length - 1; i >= 0; i--) {
        const v = num(getCell(ws, row, MONTHLY_COLS[i]));
        if (v !== null) return v;
    }
    return 0;
}

function getTarget(ws: xlsx.WorkSheet, row: number): number {
    return numOrZero(getCell(ws, row, 25)); // Y column
}

function getStretch(ws: xlsx.WorkSheet, row: number): number {
    return numOrZero(getCell(ws, row, 26)); // Z column
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LOADER
   ═══════════════════════════════════════════════════════════════ */

export const loadUKKpiData = cache(async (): Promise<UKKpiData> => {
    const filePath = path.join(process.cwd(), 'data', 'Weekly KPI Sheet - Ventured Solution.xlsx');
    const buffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(buffer, { cellDates: false });
    const ws = workbook.Sheets['UK-KPI'];
    if (!ws) throw new Error('UK-KPI sheet not found in Excel file');

    /* ── Sales ───────────────────────────────────────────── */
    const sales: UKSalesData = {
        totalPipelineGen: getMonthlyValues(ws, 17),
        salesPipelineGen: getMonthlyValues(ws, 18),
        marketingPipelineGen: getMonthlyValues(ws, 19),
        internalPipelineGen: getMonthlyValues(ws, 20),
        currentMonthPipeline: getCurrentValue(ws, 24),
        currentQuarterOpenPipeline: getCurrentValue(ws, 25),
        bookingsClosedWon: getMonthlyValues(ws, 33),
        bookingsVsObjective: getMonthlyValues(ws, 34),
        oppsClosedWon: getMonthlyValues(ws, 35),
        closedWonASP: getMonthlyValues(ws, 36),
        winRate: getMonthlyValues(ws, 27),
        salesForecast: getMonthlyValues(ws, 29),
        salesObjective: getMonthlyValues(ws, 30),
        forecastVsObjectivePct: getMonthlyValues(ws, 31),
        currentWeekTotalPipeline: getCurrentValue(ws, 17),
        currentWeekSalesPipeline: getCurrentValue(ws, 18),
        currentWeekBookings: getCurrentValue(ws, 33),
        currentWeekWinRate: getCurrentValue(ws, 27),
        currentWeekASP: getCurrentValue(ws, 36),
        currentWeekForecast: getCurrentValue(ws, 29),
        currentWeekObjective: getCurrentValue(ws, 30),
        currentWeekForecastPct: getCurrentValue(ws, 31),
        pipelineWeeklyTarget: getTarget(ws, 17),
        pipelineMonthlyTarget: getStretch(ws, 17),
        aspTarget: getTarget(ws, 36),
        aspStretch: getStretch(ws, 36),
        winRateTarget: getTarget(ws, 27),
        winRateStretch: getStretch(ws, 27),
    };

    /* ── Cross Sell ──────────────────────────────────────── */
    const crossSell: UKCrossSellData = {
        dailySalesActivity: getMonthlyValues(ws, 38),
        oppsCreated: getMonthlyValues(ws, 39),
        currentPipelineValue: getMonthlyValues(ws, 40),
        closedWon: getMonthlyValues(ws, 41),
        closedWonForecast: getMonthlyValues(ws, 42),
        currentActivity: getCurrentValue(ws, 38),
        currentOppsCreated: getCurrentValue(ws, 39),
        activityTarget: getTarget(ws, 38),
        oppsTarget: getTarget(ws, 39),
        closedWonTarget: getTarget(ws, 41),
        closedWonStretch: getStretch(ws, 41),
    };

    /* ── Retention ───────────────────────────────────────── */
    const retention: UKRetentionData = {
        proactiveCases: getMonthlyValues(ws, 44),
        highValueCommsEngaged: getMonthlyValues(ws, 48),
        highValueCommsApp: getMonthlyValues(ws, 49),
        convertedLeads: getMonthlyValues(ws, 50),
        crossSellLeads: getMonthlyValues(ws, 51),
        currentProactiveCases: getCurrentValue(ws, 44),
        currentHighValueComms: getCurrentValue(ws, 48),
        currentConvertedLeads: getCurrentValue(ws, 50),
        currentCrossSellLeads: getCurrentValue(ws, 51),
        proactiveCasesTarget: getTarget(ws, 44),
        proactiveCasesStretch: getStretch(ws, 44),
        highValueCommsTarget: getTarget(ws, 48),
        highValueCommsStretch: getStretch(ws, 48),
        convertedLeadsTarget: getTarget(ws, 50),
        convertedLeadsStretch: getStretch(ws, 50),
        crossSellLeadsTarget: getTarget(ws, 51),
        crossSellLeadsStretch: getStretch(ws, 51),
    };

    /* ── Customer Management ─────────────────────────────── */
    const customerMgmt: UKCustomerMgmtData = {
        inboundCases: getMonthlyValues(ws, 53),
        resolvedIn24h: getMonthlyValues(ws, 54),
        customerComms: getMonthlyValues(ws, 55),
        convertedLeads: getMonthlyValues(ws, 56),
        npsParticipation: getMonthlyValues(ws, 57),
        leadsGenerated: getMonthlyValues(ws, 58),
        currentInboundCases: getCurrentValue(ws, 53),
        currentResolvedIn24h: getCurrentValue(ws, 54),
        currentCustomerComms: getCurrentValue(ws, 55),
        currentConvertedLeads: getCurrentValue(ws, 56),
        currentNPS: getCurrentValue(ws, 57),
        currentLeadsGenerated: getCurrentValue(ws, 58),
        inboundTarget: getTarget(ws, 53),
        inboundStretch: getStretch(ws, 53),
        resolvedTarget: getTarget(ws, 54),
        resolvedStretch: getStretch(ws, 54),
        commsTarget: getTarget(ws, 55),
        commsStretch: getStretch(ws, 55),
        convertedLeadsTarget: getTarget(ws, 56),
        convertedLeadsStretch: getStretch(ws, 56),
    };

    /* ── Finance ─────────────────────────────────────────── */
    const finance: UKFinanceData = {
        totalAgedAR: getMonthlyValues(ws, 60),
        ar180Plus: getMonthlyValues(ws, 61),
        ar180PlusPct: getMonthlyValues(ws, 62),
        ar90Plus: getMonthlyValues(ws, 63),
        ar90PlusPct: getMonthlyValues(ws, 64),
        numBills: getMonthlyValues(ws, 65),
        netBillValue: getMonthlyValues(ws, 66),
        currentTotalAR: getCurrentValue(ws, 60),
        current180Plus: getCurrentValue(ws, 61),
        current180PlusPct: getCurrentValue(ws, 62),
        current90Plus: getCurrentValue(ws, 63),
        current90PlusPct: getCurrentValue(ws, 64),
        currentNumBills: getCurrentValue(ws, 65),
        currentNetBillValue: getCurrentValue(ws, 66),
        ar180PctTarget: getTarget(ws, 62),
        ar180PctStretch: getStretch(ws, 62),
        ar90PctTarget: getTarget(ws, 64),
        ar90PctStretch: getStretch(ws, 64),
    };

    /* ── Product ─────────────────────────────────────────── */
    const product: UKProductData = {
        appUsageMAU: getMonthlyValues(ws, 72),
        currentMAU: getCurrentValue(ws, 72),
    };

    return { sales, crossSell, retention, customerMgmt, finance, product };
});
