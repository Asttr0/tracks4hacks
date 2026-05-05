import { Activity, ShieldAlert, Globe2, Grid3x3 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatusDot } from "../../components/ui/StatusDot";

const kpis = [
  { label: "Alertes / 24h", value: "0", icon: Activity, accent: "text-red-500" },
  { label: "Incidents ouverts", value: "0", icon: ShieldAlert, accent: "text-amber-500" },
  { label: "Sources géo", value: "0", icon: Globe2, accent: "text-blue-500" },
  { label: "Techniques observées", value: "0", icon: Grid3x3, accent: "text-purple-500" },
];

export default function Overview() {
  return (
    <>
      <PageHeader
        eyebrow="● Live"
        title="Vue d'ensemble"
        description="Tableau de bord du SOC — état du flux, alertes récentes et couverture MITRE."
        actions={<StatusDot tone="live" label="Stream" />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label}>
            <div className="flex items-start justify-between">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-gray-500">
                {label}
              </p>
              <Icon size={16} className={accent} />
            </div>
            <p className="mt-3 font-mono text-3xl tabular-nums text-slate-900 dark:text-white">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Flux d'alertes" meta="Live" className="lg:col-span-2 min-h-[320px]">
          <p className="font-mono text-xs text-slate-500 dark:text-gray-500">
            Le flux SSE sera branché ici — composant à venir.
          </p>
        </Card>
        <Card title="État des sources" meta="Health" className="min-h-[320px]">
          <ul className="space-y-3 font-mono text-xs">
            <li className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-gray-300">Wazuh</span>
              <StatusDot tone="online" label="Online" />
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-gray-300">Suricata</span>
              <StatusDot tone="online" label="Active" />
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-gray-300">BFF</span>
              <StatusDot tone="warn" label="Stub" />
            </li>
          </ul>
        </Card>
      </div>
    </>
  );
}
