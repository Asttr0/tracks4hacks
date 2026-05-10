// Types for the Coverage Scoreboard page

export type MissReason = "NO_RULE" | "TIMEOUT";
export type Severity   = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface MissedAttack {
  id: string;
  time: string;
  tool: string;
  technique: string;
  techniqueName: string;
  attempts: number;
  missReason: MissReason;
  timeoutDelay?: string;
  command: string;
  targetIp: string;
  sourceIp: string;
}

export interface WazuhAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: Severity;
  time: string;
  agent: string;
  description: string;
}

export interface DetectedAttack {
  id: string;
  time: string;
  tool: string;
  technique: string;
  techniqueName: string;
  delaySeconds: number;
  command: string;
  sourceIp: string;
  targetIp: string;
  alert: WazuhAlert;
}

export interface CoverageKpi {
  coverage: number;
  totalAttacks: number;
  detectedAttacks: number;
  missedAttacks: number;
  mttdAvg: number;
  exerciseDuration: string;
}
