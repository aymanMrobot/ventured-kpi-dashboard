'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Topbar from '@/components/topbar';
import Button from '@/components/button';
import Skeleton from '@/components/skeleton';

const suggestedPrompts = [
  'Summarise weekly activity trends',
  'Identify top performers and key accounts',
  'Highlight anomalies and spikes',
  'Recommend next actions based on outcomes and statuses',
];

function AiPageContent() {
  const searchParams = useSearchParams();
  const minDate = searchParams.get('from') || '';
  const maxDate = searchParams.get('to') || '';
  const [prompt, setPrompt] = useState('');
  const [includeSummary, setIncludeSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt || prompt.length < 5) {
      setError('Please enter a prompt of at least five characters.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let context: any = undefined;
      if (includeSummary && minDate && maxDate) {
        const summaryRes = await fetch(`/api/ai/summary?from=${encodeURIComponent(minDate)}&to=${encodeURIComponent(maxDate)}`);
        if (!summaryRes.ok) {
          throw new Error('Failed to fetch data summary');
        }
        context = await summaryRes.json();
      }
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error || 'Failed to generate insights';
        throw new Error(msg);
      }
      const data = await res.json();
      setResult(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => { });
  }

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="AI Insights" subtitle="Generate executive insights with Gemini" minDate={minDate || ''} maxDate={maxDate || ''} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-3xl">
        <div className="flex flex-col gap-1">
          <label htmlFor="prompt" className="text-sm font-medium">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full rounded-md bg-surface border border-[var(--color-border)] p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            placeholder="Ask a question about your data..."
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="suggestions" className="text-sm font-medium">
            Suggested prompts
          </label>
          <select
            id="suggestions"
            className="w-full rounded-md bg-surface border border-[var(--color-border)] p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onChange={(e) => {
              const value = e.target.value;
              if (value) setPrompt(value);
            }}
            value=""
          >
            <option value="" disabled>
              Select a suggestion
            </option>
            {suggestedPrompts.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includeSummary}
            onChange={(e) => setIncludeSummary(e.target.checked)}
            className="rounded border border-[var(--color-border)] bg-surface text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
          Include data summary
        </label>
        <Button type="submit" disabled={loading} className="w-max">
          {loading ? 'Generating…' : 'Generate insights'}
        </Button>
      </form>
      {error && (
        <div className="mt-4 text-red-500 text-sm" role="alert">
          {error}
        </div>
      )}
      {loading && (
        <div className="mt-4">
          <Skeleton className="h-32 w-full" />
        </div>
      )}
      {result && !loading && (
        <div className="mt-4 flex flex-col gap-2">
          <div
            className="whitespace-pre-wrap rounded-md bg-surface border border-[var(--color-border)] p-4 text-sm"
            aria-live="polite"
          >
            {result}
          </div>
          <Button variant="secondary" onClick={handleCopy} className="w-max">
            Copy to clipboard
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AiPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <AiPageContent />
    </Suspense>
  );
}