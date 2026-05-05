export type Severity = "info" | "low" | "medium" | "high" | "critical";
export type AlertSource = "wazuh" | "suricata" | "correlator";

export interface Alert {
  id: string;
  ts: string;
  source: AlertSource;
  severity: Severity;
  ruleId: string;
  ruleDesc: string;
  agent?: { id: string; name: string };
  srcIp?: string;
  dstIp?: string;
  techniqueIds?: string[];
}
