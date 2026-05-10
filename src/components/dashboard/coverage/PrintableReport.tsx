import type { CoverageKpi, DetectedAttack, MissedAttack } from "../../../types/coverage";
import { TOOL_COLORS, SEV_TEXT_LIGHT, SEVERITY_FR, delayColor, groupByTool } from "./utils";

export interface PrintableReportProps {
  kpi: CoverageKpi;
  detected: DetectedAttack[];
  missed: MissedAttack[];
  noRuleCount: number;
  timeoutCount: number;
}

const titleStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
  color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: "4px", marginBottom: "10px",
};
const cellStyle: React.CSSProperties = { padding: "6px 8px", border: "1px solid #e2e8f0", fontSize: "9px", verticalAlign: "top" };
const thStyle:   React.CSSProperties = { ...cellStyle, background: "#f1f5f9", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "8px", color: "#334155" };

export const PrintableReport = ({ kpi, detected, missed, noRuleCount, timeoutCount }: PrintableReportProps) => {
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const time  = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const detectedByTool = groupByTool(detected);

  return (
    <div className="print-report" style={{
      display: "none", color: "#0f172a", background: "white", fontFamily: "'Helvetica Neue', Arial, sans-serif",
      padding: "0", lineHeight: 1.4,
    }}>
      <header style={{ borderBottom: "3px solid #0f172a", paddingBottom: "12px", marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: "9px", letterSpacing: "0.28em", color: "#dc2626", fontWeight: 700, margin: 0 }}>● ANALYTICS — PURPLE TEAM</p>
            <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "4px 0 2px 0", letterSpacing: "0.02em" }}>RAPPORT DE COUVERTURE</h1>
            <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>Corrélation Red Team × Wazuh — Détection des angles morts</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "9px", color: "#475569" }}>
            <p style={{ margin: 0 }}><strong>Date :</strong> {today}</p>
            <p style={{ margin: "2px 0" }}><strong>Heure :</strong> {time}</p>
            <p style={{ margin: 0 }}><strong>Durée exercice :</strong> {kpi.exerciseDuration}</p>
          </div>
        </div>
      </header>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={titleStyle}>1 · Indicateurs Clés</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {[
            { label: "Taux de Détection", value: `${kpi.coverage}%`,           sub: `${kpi.detectedAttacks} / ${kpi.totalAttacks} attaques`,         color: kpi.coverage >= 67 ? "#16a34a" : kpi.coverage >= 33 ? "#d97706" : "#dc2626" },
            { label: "Attaques Détectées",value: String(kpi.detectedAttacks), sub: "Corrélations Wazuh",                                            color: "#16a34a" },
            { label: "Angles Morts",      value: String(kpi.missedAttacks),   sub: `${noRuleCount} sans règle · ${timeoutCount} délai`,             color: "#dc2626" },
            { label: "MTTD Moyen",        value: `${kpi.mttdAvg}s`,            sub: "Mean Time To Detect",                                           color: "#0ea5e9" },
          ].map((k) => (
            <div key={k.label} style={{ border: "1px solid #cbd5e1", borderTop: `3px solid ${k.color}`, padding: "8px 10px", borderRadius: "2px" }}>
              <p style={{ fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b", margin: 0 }}>{k.label}</p>
              <p style={{ fontSize: "22px", fontWeight: 800, color: k.color, margin: "4px 0 2px 0", fontFamily: "'Courier New', monospace" }}>{k.value}</p>
              <p style={{ fontSize: "8px", color: "#475569", margin: 0 }}>{k.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={titleStyle}>2 · Attaques Détectées — Preuves de Corrélation ({detected.length})</h2>
        <p style={{ fontSize: "9px", color: "#64748b", margin: "0 0 10px 0", fontStyle: "italic" }}>
          Chaque attaque Red Team est appariée à son alerte Wazuh correspondante avec délai de détection et preuve complète.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
          {detected.map((d) => {
            const dColor = delayColor(d.delaySeconds, false);
            return (
              <div key={d.id} className="detected-card" style={{ border: "1px solid #cbd5e1", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9", padding: "5px 10px", borderBottom: "1px solid #cbd5e1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: "10px", color: "#0f172a" }}>{d.id} → {d.alert.id}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "9px", color: "#475569" }}>{d.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", fontWeight: 800, color: dColor }}>{d.delaySeconds}s</span>
                    <span style={{ fontSize: "8px", fontWeight: 700, color: SEV_TEXT_LIGHT[d.alert.severity], textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {SEVERITY_FR[d.alert.severity]}
                    </span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                  <div style={{ padding: "8px 10px", borderRight: "1px solid #e2e8f0", background: "#fef2f211" }}>
                    <p style={{ margin: 0, fontSize: "8px", fontWeight: 700, color: "#dc2626", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "5px" }}>
                      ▸ Red Team — Attaque
                    </p>
                    <table style={{ width: "100%", fontSize: "8.5px", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr><td style={{ padding: "1px 0", color: "#64748b", width: "65px" }}>Technique :</td><td style={{ padding: "1px 0" }}><strong>{d.technique}</strong> — {d.techniqueName}</td></tr>
                        <tr><td style={{ padding: "1px 0", color: "#64748b" }}>Outil :</td><td style={{ padding: "1px 0", fontFamily: "'Courier New', monospace", color: TOOL_COLORS[d.tool], fontWeight: 700 }}>{d.tool}</td></tr>
                        <tr><td style={{ padding: "1px 0", color: "#64748b" }}>IP Source :</td><td style={{ padding: "1px 0", fontFamily: "'Courier New', monospace" }}>{d.sourceIp}</td></tr>
                        <tr><td style={{ padding: "1px 0", color: "#64748b" }}>IP Cible :</td><td style={{ padding: "1px 0", fontFamily: "'Courier New', monospace" }}>{d.targetIp}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ marginTop: "5px", padding: "4px 6px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "2px" }}>
                      <p style={{ margin: 0, fontSize: "7px", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "2px" }}>Commande exécutée</p>
                      <code style={{ fontFamily: "'Courier New', monospace", fontSize: "8px", color: "#1e293b", wordBreak: "break-all", display: "block" }}>{d.command}</code>
                    </div>
                  </div>
                  <div style={{ padding: "8px 10px", background: "#eff6ff11" }}>
                    <p style={{ margin: 0, fontSize: "8px", fontWeight: 700, color: "#2563eb", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "5px" }}>
                      ▸ Wazuh — Alerte
                    </p>
                    <table style={{ width: "100%", fontSize: "8.5px", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr><td style={{ padding: "1px 0", color: "#64748b", width: "70px" }}>Horodatage :</td><td style={{ padding: "1px 0", fontFamily: "'Courier New', monospace" }}>{d.alert.time}</td></tr>
                        <tr><td style={{ padding: "1px 0", color: "#64748b" }}>ID Règle :</td><td style={{ padding: "1px 0", fontFamily: "'Courier New', monospace", fontWeight: 700 }}>#{d.alert.ruleId}</td></tr>
                        <tr><td style={{ padding: "1px 0", color: "#64748b" }}>Règle :</td><td style={{ padding: "1px 0" }}>{d.alert.ruleName}</td></tr>
                        <tr><td style={{ padding: "1px 0", color: "#64748b" }}>Agent :</td><td style={{ padding: "1px 0", fontFamily: "'Courier New', monospace" }}>{d.alert.agent}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ marginTop: "5px", padding: "4px 6px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "2px" }}>
                      <p style={{ margin: 0, fontSize: "7px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "2px" }}>Description</p>
                      <p style={{ margin: 0, fontSize: "8px", color: "#1e293b", lineHeight: 1.4 }}>{d.alert.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={titleStyle}>3 · Angles Morts — Attaques Manquées ({missed.length})</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th><th style={thStyle}>Heure</th><th style={thStyle}>Outil</th>
              <th style={thStyle}>Technique MITRE</th><th style={thStyle}>Tentatives</th>
              <th style={thStyle}>Cause</th><th style={thStyle}>Cible</th>
            </tr>
          </thead>
          <tbody>
            {missed.map((m) => (
              <tr key={m.id}>
                <td style={{ ...cellStyle, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>{m.id}</td>
                <td style={{ ...cellStyle, fontFamily: "'Courier New', monospace" }}>{m.time}</td>
                <td style={{ ...cellStyle, fontFamily: "'Courier New', monospace", color: TOOL_COLORS[m.tool] }}>{m.tool}</td>
                <td style={cellStyle}><strong>{m.technique}</strong> — {m.techniqueName}</td>
                <td style={{ ...cellStyle, textAlign: "center", fontFamily: "'Courier New', monospace" }}>{m.attempts}</td>
                <td style={{ ...cellStyle, color: "#dc2626", fontWeight: 700 }}>
                  {m.missReason === "NO_RULE" ? "RÈGLE MANQUANTE" : `DÉLAI DÉPASSÉ ${m.timeoutDelay ?? ""}`}
                </td>
                <td style={{ ...cellStyle, fontFamily: "'Courier New', monospace" }}>{m.targetIp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={titleStyle}>4 · Répartition par Outil Red Team</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Outil</th><th style={thStyle}>Détections</th>
              <th style={thStyle}>Délai Moyen</th><th style={thStyle}>Part du Total</th>
            </tr>
          </thead>
          <tbody>
            {detectedByTool.map((t) => (
              <tr key={t.tool}>
                <td style={{ ...cellStyle, fontFamily: "'Courier New', monospace", fontWeight: 700, color: TOOL_COLORS[t.tool] }}>{t.tool}</td>
                <td style={{ ...cellStyle, textAlign: "center", fontFamily: "'Courier New', monospace" }}>{t.count}</td>
                <td style={{ ...cellStyle, textAlign: "center", fontFamily: "'Courier New', monospace", color: delayColor(t.avgDelay, false) }}>{t.avgDelay}s</td>
                <td style={{ ...cellStyle, textAlign: "center", fontFamily: "'Courier New', monospace" }}>{Math.round((t.count / detected.length) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={titleStyle}>5 · Charges Utiles des Attaques Manquées</h2>
        <p style={{ fontSize: "9px", color: "#64748b", margin: "0 0 8px 0", fontStyle: "italic" }}>
          Commandes ayant échappé à la détection Wazuh — base pour la création de nouvelles règles.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px" }}>
          {missed.map((a) => (
            <div key={a.id} style={{ border: "1px solid #e2e8f0", borderLeft: "3px solid #dc2626", padding: "6px 10px", fontSize: "9px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontFamily: "'Courier New', monospace", fontWeight: 700 }}>{a.id} · {a.time} · <span style={{ color: TOOL_COLORS[a.tool] }}>{a.tool}</span></span>
                <span style={{ fontWeight: 700, color: "#dc2626" }}>✗ {a.missReason === "NO_RULE" ? "RÈGLE MANQUANTE" : `DÉLAI DÉPASSÉ ${a.timeoutDelay ?? ""}`}</span>
              </div>
              <p style={{ margin: "2px 0", fontFamily: "'Courier New', monospace", fontSize: "8px", color: "#1e293b", wordBreak: "break-all" }}>{a.command}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: "24px", paddingTop: "10px", borderTop: "1px solid #cbd5e1", fontSize: "8px", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
        <span>Tracks4Hacks · Coverage Scoreboard · Rapport généré automatiquement</span>
        <span>Page <span className="page-number" /></span>
      </footer>
    </div>
  );
};
