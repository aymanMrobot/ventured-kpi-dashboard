import Topbar from '@/components/topbar';

export const dynamic = 'force-dynamic';


export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Settings" subtitle="Application settings" minDate="" maxDate="" />
      <p className="text-muted">This section is under construction.</p>
    </div>
  );
}