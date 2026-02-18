import Topbar from '@/components/topbar';
import Card from '@/components/card';
import { Server, Activity, GitBranch, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

const plannedFeatures = [
    {
        icon: <Activity size={20} />,
        title: 'System Uptime',
        description: 'Monitor service availability, response times, and SLA compliance',
    },
    {
        icon: <GitBranch size={20} />,
        title: 'Deployment Tracker',
        description: 'Track releases, rollbacks, and deployment frequency across environments',
    },
    {
        icon: <Shield size={20} />,
        title: 'Incident Management',
        description: 'View open incidents, MTTR, and post-mortem summaries',
    },
    {
        icon: <Server size={20} />,
        title: 'Infrastructure Health',
        description: 'Monitor resource utilisation, costs, and capacity planning metrics',
    },
];

export default function DevOpsPage() {
    return (
        <div className="flex flex-col gap-6">
            <Topbar title="DevOps" subtitle="Infrastructure & operations" minDate="" maxDate="" />

            <Card className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <Server size={28} className="text-brand" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Coming Soon</h2>
                        <p className="text-sm text-muted mt-1 max-w-md mx-auto">
                            The DevOps dashboard will provide real-time infrastructure monitoring and deployment analytics.
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
