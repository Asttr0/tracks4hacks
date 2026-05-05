import type { Alert } from "../types/Alert";

export const sampleAlerts: Alert[] = [
  {
    id: "demo-1",
    ts: new Date().toISOString(),
    source: "wazuh",
    severity: "high",
    ruleId: "5710",
    ruleDesc: "Multiple authentication failures",
    agent: { id: "001", name: "debian-vm" },
    srcIp: "203.0.113.42",
    techniqueIds: ["T1110"],
  },
  {
    id: "demo-2",
    ts: new Date(Date.now() - 60_000).toISOString(),
    source: "suricata",
    severity: "critical",
    ruleId: "2010935",
    ruleDesc: "ET EXPLOIT Possible CVE attempt",
    srcIp: "198.51.100.7",
    dstIp: "10.0.0.4",
    techniqueIds: ["T1190"],
  },
];
