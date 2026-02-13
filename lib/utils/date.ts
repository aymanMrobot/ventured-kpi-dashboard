import { parse, isValid, format, parseISO } from 'date-fns';

/**
 * Parse a date string in dd/MM/yyyy format. Returns undefined if invalid.
 */
export function parseUKDate(value: string): Date | undefined {
  const parsed = parse(value, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : undefined;
}

/**
 * Parse an ISO date string. Returns undefined if invalid.
 */
export function parseIsoDate(value: string): Date | undefined {
  try {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  } catch (e) {
    return undefined;
  }
}

/**
 * Format a Date object as an ISO yyyy-MM-dd string.
 */
export function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Format a Date object for human display (e.g. 5 Jan 2026).
 */
export function formatHumanDate(date: Date): string {
  return format(date, 'd MMM yyyy');
}