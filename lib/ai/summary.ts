import { loadCalls, loadEmails } from '../data/excel';
import { computeOverviewMetrics, computeSalesMetrics, computeEmailsMetrics } from '../metrics';

/**
 * Build a concise executive summary of the activity data between the given dates.
 * The summary is returned as a plain object. It is intended to be serialised to JSON
 * and sent to the AI endpoint when the user toggles “Include data summary”.
 */
export async function buildExecutiveSummary(from: string, to: string) {
  const [calls, emails] = await Promise.all([loadCalls(), loadEmails()]);
  const overview = computeOverviewMetrics(calls, emails, from, to);
  const sales = computeSalesMetrics(calls, from, to);
  const emailsMetrics = computeEmailsMetrics(emails, from, to);

  // Determine highest and lowest activity days across all activities
  const combinedTrend: Record<string, number> = {};
  overview.callsByDay.forEach((p) => {
    combinedTrend[p.date] = (combinedTrend[p.date] || 0) + p.count;
  });
  overview.emailsByDay.forEach((p) => {
    combinedTrend[p.date] = (combinedTrend[p.date] || 0) + p.count;
  });
  const trendPoints = Object.entries(combinedTrend).map(([date, count]) => ({ date, count }));
  trendPoints.sort((a, b) => a.count - b.count);
  const lowestDay = trendPoints[0];
  const highestDay = trendPoints[trendPoints.length - 1];

  return {
    totals: {
      activities: overview.totalActivities,
      calls: overview.totalCalls,
      emails: overview.totalEmails,
      activeUsers: overview.activeUsers,
    },
    topAssignedToCalls: sales.callsByUser.slice(0, 3),
    topAssignedToEmails: emailsMetrics.emailsByUser.slice(0, 3),
    topTopics: sales.callsByTopic.slice(0, 3),
    topOutcomes: sales.callsByOutcome.slice(0, 3),
    statusDistribution: emailsMetrics.emailsByStatus.slice(0, 5),
    trendHighlights: {
      highestDay,
      lowestDay,
    },
  };
}