import { Activity, ShieldAlert, Globe2, Grid3x3 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatusDot } from "../../components/ui/StatusDot";
import { Badge } from "../../components/ui/Badge";
import { useStreamStore } from "../../store/streamStore";
import { useStream } from "../../hooks/useStream";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function Overview() {
  const { status } = useStream();
  const alerts = useStreamStore((s) => s.alerts);

  const cutoff = new Date(Date.now() - DAY_MS).toISOString();
  const alerts24h = alerts.filter((a) => a.ts >= cutoff).length;
  const techniques = new Set(alerts.flatMap((a) => a.techniqueIds ?? [])).size;
  const srcIps = new Set(alerts.map((a) => a.srcIp).filter(Boolean)).size;

  const streamTone = status === "open" ? "live" : status === "error" ? "offline" : "warn";

  const kpis = [
    { label: "Alertes / 24h", value: alerts24h, icon: Activity, accent: "text-red-500" },
    { label: "Incidents ouverts", value: 0, icon: ShieldAlert, accent: "text-amber-500" },
    { label: "Sources géo", value: srcIps, icon: Globe2, accent: "text-blue-500" },
    { label: "Techniques observées", value: techniques, icon: Grid3x3, accent: "text-purple-500" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="● Live"
        title="Vue d'ensemble"
        description="Tableau de bord du SOC — état du flux, alertes récentes et couverture MITRE."
        actions={<StatusDot tone={streamTone} label="Stream" />}
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
          {alerts.length === 0 ? (
            <p className="font-mono text-xs text-slate-500 dark:text-gray-500">
              {status === "connecting" ? "Connexion au flux…" : "En attente d'alertes…"}
            </p>
          ) : (
            <ul className="space-y-2 overflow-y-auto max-h-72">
              {alerts.slice(0, 30).map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 rounded border border-slate-100 bg-slate-50 p-2 dark:border-soc-border dark:bg-soc-bg"
                >
                  <Badge severity={a.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-slate-800 dark:text-gray-200">
                      {a.ruleDesc}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400 dark:text-gray-600">
                      {a.agent?.name ?? "—"} · {new Date(a.ts).toLocaleTimeString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="État des sources" meta="Health" className="min-h-[320px]">
          <ul className="space-y-3 font-mono text-xs">
            <li className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-gray-300">Wazuh</span>
              <StatusDot tone={status === "open" ? "online" : "warn"} label={status === "open" ? "Online" : "..."} />
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-gray-300">Suricata</span>
              <StatusDot tone="online" label="Active" />
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-gray-300">BFF</span>
              <StatusDot tone={status === "open" ? "online" : "warn"} label={status === "open" ? "Live" : "Connecting"} />
            </li>
          </ul>
          {alerts.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-soc-border">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-600 mb-2">
                Dernières sévérités
              </p>
              <div className="flex flex-wrap gap-1">
                {["critical","high","medium","low","info"].map((sev) => {
                  const count = alerts.filter((a) => a.severity === sev).length;
                  return count > 0 ? (
                    <span key={sev} className="flex items-center gap-1">
                      <Badge severity={sev as never} />
                      <span className="font-mono text-[10px] text-slate-500 dark:text-gray-500">{count}</span>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
