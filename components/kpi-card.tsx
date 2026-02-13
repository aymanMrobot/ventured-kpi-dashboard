import type { ReactNode } from 'react';
import Card from './card';
import { cn } from '@/lib/utils/cn';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  right?: ReactNode;
}

export default function KpiCard({ title, value, subtitle, right }: KpiCardProps) {
  return (
    <Card className="min-w-[200px] snap-start group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">{title}</span>
          <span className="text-2xl font-bold tabular-nums tracking-tight">{value}</span>
          {subtitle && (
            <span className="text-xs text-muted">{subtitle}</span>
          )}
        </div>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
    </Card>
  );
}