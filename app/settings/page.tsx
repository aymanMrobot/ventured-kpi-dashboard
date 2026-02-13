'use client';
import { useState } from 'react';
import Topbar from '@/components/topbar';
import Card from '@/components/card';
import { Database, BarChart3, Workflow, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fields: {
    label: string;
    placeholder: string;
    type: 'text' | 'password' | 'url' | 'number';
    suffix?: string;
  }[];
  docsUrl: string;
}

const integrations: Integration[] = [
  {
    id: 'powerbi',
    name: 'Power BI',
    description: 'Connect to Power BI REST API to import datasets and reports',
    icon: <BarChart3 size={22} />,
    color: '#f2c811',
    fields: [
      { label: 'Workspace ID', placeholder: 'e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890', type: 'text' },
      { label: 'Dataset ID', placeholder: 'e.g. d1e2f3a4-b5c6-7890-abcd-ef1234567890', type: 'text' },
      { label: 'API Key', placeholder: 'Enter your Power BI API key', type: 'password' },
      { label: 'Refresh Interval', placeholder: '60', type: 'number', suffix: 'minutes' },
    ],
    docsUrl: 'https://learn.microsoft.com/en-us/rest/api/power-bi/',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync CRM data including opportunities, leads, and account metrics',
    icon: <Database size={22} />,
    color: '#00a1e0',
    fields: [
      { label: 'Instance URL', placeholder: 'https://yourcompany.my.salesforce.com', type: 'url' },
      { label: 'Client ID', placeholder: 'Enter Salesforce Connected App client ID', type: 'text' },
      { label: 'Client Secret', placeholder: 'Enter client secret', type: 'password' },
      { label: 'Object Mapping', placeholder: 'Opportunity, Lead, Account', type: 'text' },
    ],
    docsUrl: 'https://developer.salesforce.com/docs/apis',
  },
  {
    id: 'n8n',
    name: 'N8N Automation',
    description: 'Set up webhook-based automations to push or pull data on a schedule',
    icon: <Workflow size={22} />,
    color: '#ea4b71',
    fields: [
      { label: 'Webhook URL', placeholder: 'https://your-n8n-instance.com/webhook/...', type: 'url' },
      { label: 'Auth Header', placeholder: 'Bearer token or API key', type: 'password' },
      { label: 'Sync Schedule', placeholder: 'e.g. every 30 minutes', type: 'text' },
    ],
    docsUrl: 'https://docs.n8n.io/integrations/',
  },
];

type ConnectionStatus = 'disconnected' | 'testing' | 'connected' | 'error';

export default function SettingsPage() {
  const [statuses, setStatuses] = useState<Record<string, ConnectionStatus>>({});

  const handleTest = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'testing' }));
    // Simulate a test connection
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: 'connected' }));
    }, 2000);
  };

  const getStatusBadge = (status: ConnectionStatus | undefined) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 size={14} /> Connected
          </span>
        );
      case 'testing':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
            <Loader2 size={14} className="animate-spin" /> Testing…
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
            <XCircle size={14} /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text/40">
            <XCircle size={14} /> Disconnected
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Settings" subtitle="Data integrations & configuration" minDate="" maxDate="" />

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Data Sources</h2>
          <p className="text-xs text-text/40">Connect your data platforms to sync KPIs automatically</p>
        </div>

        {integrations.map((integration) => (
          <Card key={integration.id}>
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${integration.color}15`, color: integration.color }}
                >
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{integration.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{integration.description}</p>
                </div>
              </div>
              {getStatusBadge(statuses[integration.id])}
            </div>

            {/* Fields */}
            <div className="grid gap-4 md:grid-cols-2 mb-5">
              {integration.fields.map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-medium text-muted uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <div className="flex">
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2 text-sm text-text placeholder:text-text/25 focus:outline-none focus:ring-1 focus:ring-brand/50 focus:border-brand/30 transition-colors"
                    />
                    {field.suffix && (
                      <span className="ml-2 flex items-center text-xs text-muted whitespace-nowrap">
                        {field.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <a
                href={integration.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand hover:text-brand/80 transition-colors"
              >
                View docs <ExternalLink size={12} />
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTest(integration.id)}
                  disabled={statuses[integration.id] === 'testing'}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                >
                  Test Connection
                </button>
                <button className="px-4 py-2 text-xs font-medium rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors shadow-[0_0_12px_rgba(10,168,183,0.3)]">
                  Save
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}