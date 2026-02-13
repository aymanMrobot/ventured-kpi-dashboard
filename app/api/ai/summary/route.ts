import { NextRequest, NextResponse } from 'next/server';
import { buildExecutiveSummary } from '@/lib/ai/summary';

// Use Node.js runtime because we rely on file system to read Excel files
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!from || !to) {
    return NextResponse.json({ error: 'Missing from or to parameters' }, { status: 400 });
  }
  try {
    const summary = await buildExecutiveSummary(from, to);
    return NextResponse.json(summary);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to build summary' }, { status: 500 });
  }
}