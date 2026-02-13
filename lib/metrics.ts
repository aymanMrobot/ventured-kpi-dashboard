import { CallRow, EmailRow } from './data/excel';
import { parseIsoDate } from './utils/date';

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface KeyCount {
  key: string;
  count: number;
}

export interface OverviewMetrics {
  totalActivities: number;
  totalCalls: number;
  totalEmails: number;
  activeUsers: number;
  callsByDay: TimeSeriesPoint[];
  emailsByDay: TimeSeriesPoint[];
  topAccounts: KeyCount[];
}

export interface SalesMetrics {
  callsByUser: KeyCount[];
  callsByOutcome: KeyCount[];
  callsByTopic: KeyCount[];
  callsTrend: TimeSeriesPoint[];
}

export interface EmailsMetrics {
  emailsByUser: KeyCount[];
  emailsByStatus: KeyCount[];
  emailsTrend: TimeSeriesPoint[];
  topSubjects: KeyCount[];
}

export interface SupportMetrics {
  callsByOutcome: KeyCount[];
  emailsByStatus: KeyCount[];
  trend: TimeSeriesPoint[];
  topPerformers: KeyCount[];
}

/**
 * Helper to filter a list of rows by ISO date range.
 */
function filterByDateRange<T extends { date: string }>(rows: T[], from: string, to: string): T[] {
  const fromDate = parseIsoDate(from);
  const toDate = parseIsoDate(to);
  if (!fromDate || !toDate) return rows;
  return rows.filter((row) => {
    const d = parseIsoDate(row.date);
    return d && d >= fromDate && d <= toDate;
  });
}

/**
 * Aggregate items by a key and return sorted counts descending.
 */
function aggregateBy<T>(rows: T[], keyFn: (row: T) => string): KeyCount[] {
  const map: Record<string, number> = {};
  rows.forEach((row) => {
    const key = keyFn(row) || 'Unknown';
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Aggregate time series by date in ISO string and return ascending by date.
 */
function aggregateByDate<T extends { date: string }>(rows: T[]): TimeSeriesPoint[] {
  const map: Record<string, number> = {};
  rows.forEach((row) => {
    map[row.date] = (map[row.date] || 0) + 1;
  });
  return Object.entries(map)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

/**
 * Compute overview metrics from calls and emails within the given date range.
 */
export function computeOverviewMetrics(
  calls: CallRow[],
  emails: EmailRow[],
  from: string,
  to: string,
): OverviewMetrics {
  const callsInRange = filterByDateRange(calls, from, to);
  const emailsInRange = filterByDateRange(emails, from, to);
  const totalCalls = callsInRange.length;
  const totalEmails = emailsInRange.length;
  const totalActivities = totalCalls + totalEmails;
  const users = new Set<string>();
  callsInRange.forEach((c) => users.add(c.assignedTo));
  emailsInRange.forEach((e) => users.add(e.assignedTo));
  const activeUsers = users.size;
  const callsByDay = aggregateByDate(callsInRange);
  const emailsByDay = aggregateByDate(emailsInRange);
  // Combine activities by account (calls + emails)
  const combined: Array<{ account: string }> = [];
  callsInRange.forEach((c) => combined.push({ account: c.accountName }));
  emailsInRange.forEach((e) => combined.push({ account: e.companyAccount }));
  const topAccounts = aggregateBy(combined, (x) => x.account).slice(0, 5);
  return {
    totalActivities,
    totalCalls,
    totalEmails,
    activeUsers,
    callsByDay,
    emailsByDay,
    topAccounts,
  };
}

export function computeSalesMetrics(
  calls: CallRow[],
  from: string,
  to: string,
): SalesMetrics {
  const callsInRange = filterByDateRange(calls, from, to);
  const callsByUser = aggregateBy(callsInRange, (c) => c.assignedTo);
  const callsByOutcome = aggregateBy(callsInRange, (c) => c.outcome || 'Unknown');
  const callsByTopic = aggregateBy(callsInRange, (c) => c.topic || 'Unknown');
  const callsTrend = aggregateByDate(callsInRange);
  return { callsByUser, callsByOutcome, callsByTopic, callsTrend };
}

export function computeEmailsMetrics(
  emails: EmailRow[],
  from: string,
  to: string,
): EmailsMetrics {
  const emailsInRange = filterByDateRange(emails, from, to);
  const emailsByUser = aggregateBy(emailsInRange, (e) => e.assignedTo);
  const emailsByStatus = aggregateBy(emailsInRange, (e) => e.status || 'Unknown');
  const emailsTrend = aggregateByDate(emailsInRange);
  const topSubjects = aggregateBy(emailsInRange, (e) => e.subject || 'Unknown').slice(0, 10);
  return { emailsByUser, emailsByStatus, emailsTrend, topSubjects };
}

export function computeSupportMetrics(
  calls: CallRow[],
  emails: EmailRow[],
  from: string,
  to: string,
): SupportMetrics {
  const callsInRange = filterByDateRange(calls, from, to);
  const emailsInRange = filterByDateRange(emails, from, to);
  const callsByOutcome = aggregateBy(callsInRange, (c) => c.outcome || 'Unknown');
  const emailsByStatus = aggregateBy(emailsInRange, (e) => e.status || 'Unknown');
  // Trend of combined activities per day
  const combinedByDay: Record<string, number> = {};
  callsInRange.forEach((c) => {
    combinedByDay[c.date] = (combinedByDay[c.date] || 0) + 1;
  });
  emailsInRange.forEach((e) => {
    combinedByDay[e.date] = (combinedByDay[e.date] || 0) + 1;
  });
  const trend = Object.entries(combinedByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  // Top performers by combined activities
  const performers: Record<string, number> = {};
  callsInRange.forEach((c) => {
    const user = c.assignedTo || 'Unknown';
    performers[user] = (performers[user] || 0) + 1;
  });
  emailsInRange.forEach((e) => {
    const user = e.assignedTo || 'Unknown';
    performers[user] = (performers[user] || 0) + 1;
  });
  const topPerformers = Object.entries(performers)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  return { callsByOutcome, emailsByStatus, trend, topPerformers };
}