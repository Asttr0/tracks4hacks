import type { Alert } from "../types/Alert";

// Real, geolocatable public IPs spread across continents so the demo map
// renders multiple arcs. Avoid RFC 5737 test ranges — they don't resolve.
const now = Date.now();

export const sampleAlerts: Alert[] = [
  {
    id: "demo-1",
    ts: new Date(now).toISOString(),
    source: "wazuh",
    severity: "critical",
    ruleId: "2010935",
    ruleDesc: "ET EXPLOIT Possible CVE attempt",
    agent: { id: "001", name: "debian-vm" },
    srcIp: "185.220.101.1", // Tor exit, DE
    dstIp: "10.0.0.4",
    techniqueIds: ["T1190"],
  },
  {
    id: "demo-2",
    ts: new Date(now - 60_000).toISOString(),
    source: "wazuh",
    severity: "high",
    ruleId: "5710",
    ruleDesc: "Multiple authentication failures",
    agent: { id: "001", name: "debian-vm" },
    srcIp: "45.155.205.233", // RU
    techniqueIds: ["T1110"],
  },
  {
    id: "demo-3",
    ts: new Date(now - 120_000).toISOString(),
    source: "suricata",
    severity: "high",
    ruleId: "2024897",
    ruleDesc: "ET SCAN Suspicious inbound to mySQL port 3306",
    srcIp: "121.40.95.50", // CN
    dstIp: "10.0.0.4",
    techniqueIds: ["T1046"],
  },
  {
    id: "demo-4",
    ts: new Date(now - 200_000).toISOString(),
    source: "wazuh",
    severity: "medium",
    ruleId: "31151",
    ruleDesc: "Multiple web server 400 error codes",
    agent: { id: "002", name: "nginx-edge" },
    srcIp: "104.244.72.7", // US
    techniqueIds: ["T1595"],
  },
  {
    id: "demo-5",
    ts: new Date(now - 300_000).toISOString(),
    source: "suricata",
    severity: "low",
    ruleId: "2013030",
    ruleDesc: "ET POLICY curl User-Agent Outbound",
    srcIp: "102.88.137.213", // NG
    dstIp: "10.0.0.4",
    techniqueIds: ["T1071"],
  },
  {
    id: "demo-6",
    ts: new Date(now - 420_000).toISOString(),
    source: "wazuh",
    severity: "high",
    ruleId: "5715",
    ruleDesc: "SSH brute force attempt",
    agent: { id: "001", name: "debian-vm" },
    srcIp: "203.205.219.1", // VN
    techniqueIds: ["T1110.001"],
  },
];
