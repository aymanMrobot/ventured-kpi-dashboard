import Topbar from '@/components/topbar';
import Card from '@/components/card';
import { Users, BarChart3, Target, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

const plannedFeatures = [
    {
        icon: <Users size={20} />,
        title: 'Client Health Scores',
        description: 'Track NPS, CSAT, and engagement scores across all managed accounts',
    },
    {
        icon: <BarChart3 size={20} />,
        title: 'Retention Metrics',
        description: 'Monitor churn rate, renewal pipeline, and expansion revenue',
    },
    {
        icon: <Target size={20} />,
        title: 'Onboarding Tracker',
        description: 'Visualise onboarding progress and time-to-value for new clients',
    },
    {
        icon: <MessageSquare size={20} />,
        title: 'Support Escalations',
        description: 'Track CSM-handled escalations, resolution times, and satisfaction',
    },
];

export default function CSMPage() {
    return (
        <div className="flex flex-col gap-6">
            <Topbar title="CSM" subtitle="Customer Success Management" minDate="" maxDate="" />

            <Card className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <Users size={28} className="text-brand" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Coming Soon</h2>
                        <p className="text-sm text-muted mt-1 max-w-md mx-auto">
                            The CSM dashboard will be integrated with your existing tools to provide real-time customer success metrics.
                        </p>
                    </div>
                </div>
            </Card>

            <div>
                <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Planned Features</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {plannedFeatures.map((feature) => (
                        <Card key={feature.title}>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-surface-elevated)] flex items-center justify-center text-[var(--color-muted)]">
                                    {feature.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{feature.title}</p>
                                    <p className="text-xs text-muted mt-0.5">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
