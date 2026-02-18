import Topbar from '@/components/topbar';
import Card from '@/components/card';
import { Headphones, BarChart3, Clock, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

const plannedFeatures = [
  {
    icon: <Headphones size={20} />,
    title: 'Ticket Volume & Resolution',
    description: 'Track open tickets, resolution times, and SLA compliance across all channels',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Customer Satisfaction',
    description: 'Monitor CSAT scores, NPS, and feedback trends from support interactions',
  },
  {
    icon: <Clock size={20} />,
    title: 'Response Time Analytics',
    description: 'Visualise first-response times, average handle time, and queue depths',
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Support Channel Breakdown',
    description: 'Analyse support volume across email, chat, phone, and self-service',
  },
];

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Support" subtitle="Customer support operations" minDate="" maxDate="" />

      <Card className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Headphones size={28} className="text-brand" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Coming Soon</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1 max-w-md mx-auto">
              The Support dashboard will be integrated with your ticketing system to provide real-time support metrics and analytics.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-4">Planned Features</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {plannedFeatures.map((feature) => (
            <Card key={feature.title}>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-muted)]">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{feature.title}</p>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}