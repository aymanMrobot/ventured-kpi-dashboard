import path from 'path';
import fs from 'fs';
import * as xlsx from 'xlsx';
import { cache } from 'react';
import { parseUKDate, parseIsoDate, toIsoDate } from '../utils/date';

export interface CallRow {
  date: string;
  activityType: string;
  subject: string;
  assignedTo: string;
  accountName: string;
  relatedTo: string;
  topic: string;
  outcome: string;
}

export interface EmailRow {
  date: string;
  assignedTo: string;
  activityType: string;
  companyAccount: string;
  opportunity: string;
  contact: string;
  lead: string;
  subject: string;
  priority: string;
  status: string;
  task: string;
  taskSubtype: string;
}

/**
 * Normalise a cell value to a trimmed string. Null or undefined become an empty string.
 */
function normaliseCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Internal helper to detect the header row index. Returns the index of the first row that contains
 * all required keys. Keys are compared case‑insensitively.
 */
function findHeaderIndex(rows: any[][], required: string[]): number {
  return rows.findIndex((row) => {
    const lowerCells = row.map((cell) => String(cell || '').toLowerCase().trim());
    return required.every((key) =>
      lowerCells.some((cell) => cell.startsWith(key.toLowerCase())),
    );
  });
}

/**
 * Load call records from the Excel file. Caches the result for the lifetime of the server.
 */
export const loadCalls = cache(async (): Promise<CallRow[]> => {
  const filePath = path.join(process.cwd(), 'data', 'calls.xlsx');
  const buffer = fs.readFileSync(filePath);
  const workbook = xlsx.read(buffer, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows: any[][] = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
    defval: null,
  });

  // Define mapping from header text to field names
  const mapping: Record<string, keyof CallRow> = {
    date: 'date',
    'activity type': 'activityType',
    subject: 'subject',
    'assigned to': 'assignedTo',
    'assigned to: full name': 'assignedTo',
    'assigned to full name': 'assignedTo',
    account: 'accountName',
    'account: account name': 'accountName',
    'account name': 'accountName',
    'related to': 'relatedTo',
    'related to: name': 'relatedTo',
    topic: 'topic',
    outcome: 'outcome',
  };

  // Determine the header row
  const headerIndex = findHeaderIndex(rawRows, ['Date', 'Activity Type', 'Assigned']);
  if (headerIndex < 0) {
    throw new Error('Failed to find header row in calls.xlsx');
  }

  const headerRow = rawRows[headerIndex];
  const columnIndexToField: Record<number, keyof CallRow> = {};
  headerRow.forEach((cell: any, idx: number) => {
    const key = String(cell || '').toLowerCase().trim();
    if (mapping[key]) {
      columnIndexToField[idx] = mapping[key];
    }
  });

  const results: CallRow[] = [];
  for (let i = headerIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;
    const record: Partial<CallRow> = {
      date: '',
      activityType: '',
      subject: '',
      assignedTo: '',
      accountName: '',
      relatedTo: '',
      topic: '',
      outcome: '',
    };
    Object.entries(columnIndexToField).forEach(([colIdxStr, field]) => {
      const colIdx = Number(colIdxStr);
      const value = row[colIdx];
      if (field === 'date') {
        const strVal = normaliseCell(value);
        let parsed = parseUKDate(strVal);
        if (!parsed) parsed = parseIsoDate(strVal);
        record.date = parsed ? toIsoDate(parsed) : '';
      } else {
        record[field] = normaliseCell(value);
      }
    });
    // Only include rows with a date
    if (record.date) {
      results.push(record as CallRow);
    }
  }
  return results;
});

/**
 * Load email records from the Excel file. Caches the result for the lifetime of the server.
 */
export const loadEmails = cache(async (): Promise<EmailRow[]> => {
  const filePath = path.join(process.cwd(), 'data', 'emails.xlsx');
  const buffer = fs.readFileSync(filePath);
  const workbook = xlsx.read(buffer, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows: any[][] = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
    defval: null,
  });

  // Mapping from header to field names
  const mapping: Record<string, keyof EmailRow> = {
    date: 'date',
    assigned: 'assignedTo',
    'activity type': 'activityType',
    'company / account': 'companyAccount',
    'company/ account': 'companyAccount',
    'company /account': 'companyAccount',
    'company/account': 'companyAccount',
    company: 'companyAccount',
    account: 'companyAccount',
    opportunity: 'opportunity',
    contact: 'contact',
    lead: 'lead',
    subject: 'subject',
    priority: 'priority',
    status: 'status',
    task: 'task',
    'task subtype': 'taskSubtype',
  };

  // Find header row: must contain at least Assigned and Date
  const headerIndex = findHeaderIndex(rawRows, ['Assigned', 'Date']);
  if (headerIndex < 0) {
    throw new Error('Failed to find header row in emails.xlsx');
  }

  const headerRow = rawRows[headerIndex];
  const columnIndexToField: Record<number, keyof EmailRow> = {};
  headerRow.forEach((cell: any, idx: number) => {
    const key = String(cell || '').toLowerCase().trim();
    if (mapping[key]) {
      columnIndexToField[idx] = mapping[key];
    }
  });

  const results: EmailRow[] = [];
  for (let i = headerIndex + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;
    const record: Partial<EmailRow> = {
      date: '',
      assignedTo: '',
      activityType: '',
      companyAccount: '',
      opportunity: '',
      contact: '',
      lead: '',
      subject: '',
      priority: '',
      status: '',
      task: '',
      taskSubtype: '',
    };
    Object.entries(columnIndexToField).forEach(([colIdxStr, field]) => {
      const colIdx = Number(colIdxStr);
      const value = row[colIdx];
      if (field === 'date') {
        const strVal = normaliseCell(value);
        let parsed = parseUKDate(strVal);
        if (!parsed) parsed = parseIsoDate(strVal);
        record.date = parsed ? toIsoDate(parsed) : '';
      } else {
        record[field] = normaliseCell(value);
      }
    });
    if (record.date) {
      results.push(record as EmailRow);
    }
  }
  return results;
});