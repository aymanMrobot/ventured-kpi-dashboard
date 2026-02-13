import type { ReactNode } from 'react';
import Card from './card';
import { cn } from '@/lib/utils/cn';

interface KpiCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

export default function KpiCard({ title, value, subtitle, right, className }: KpiCardProps) {
  return (
    <Card
      className={cn(
        'min-w-[12rem] flex flex-col justify-between gap-2 scroll-snap-start',
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        {right && <div>{right}</div>}
      </div>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
    </Card>
  );
}