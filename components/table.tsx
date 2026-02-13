import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TableProps {
  headers: string[];
  rows: Array<Array<ReactNode>>;
  className?: string;
}

/**
 * Simple accessible table with column headers and rows. Use for fallback presentations where
 * a chart is not accessible to assistive technology. Accepts arbitrary React nodes.
 */
export default function Table({ headers, rows, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--color-border)]">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="py-2 px-3 font-medium text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-surface' : 'bg-surface/80'}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 px-3 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}