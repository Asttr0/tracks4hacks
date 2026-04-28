import type { MitreTactic, MitreTechnique } from '@/types/mitre'

export const TACTICS: MitreTactic[] = [
  { id: 'TA0043', name: 'Reconnaissance',       short: 'Recon' },
  { id: 'TA0042', name: 'Resource Development', short: 'Res Dev' },
  { id: 'TA0001', name: 'Initial Access',       short: 'Initial' },
  { id: 'TA0002', name: 'Execution',            short: 'Exec' },
  { id: 'TA0003', name: 'Persistence',          short: 'Persist' },
  { id: 'TA0004', name: 'Privilege Escalation', short: 'PrivEsc' },
  { id: 'TA0005', name: 'Defense Evasion',      short: 'Evasion' },
  { id: 'TA0006', name: 'Credential Access',    short: 'Cred' },
  { id: 'TA0007', name: 'Discovery',            short: 'Discover' },
  { id: 'TA0008', name: 'Lateral Movement',     short: 'Lateral' },
  { id: 'TA0009', name: 'Collection',           short: 'Collect' },
  { id: 'TA0011', name: 'Command & Control',    short: 'C2' },
  { id: 'TA0010', name: 'Exfiltration',         short: 'Exfil' },
  { id: 'TA0040', name: 'Impact',               short: 'Impact' }
]

export const TECHNIQUES: MitreTechnique[] = [
  { id: 'T1595', name: 'Active Scanning',              tactic: 'TA0043' },
  { id: 'T1046', name: 'Network Service Scanning',     tactic: 'TA0007' },
  { id: 'T1110', name: 'Brute Force',                  tactic: 'TA0006' },
  { id: 'T1110.001', name: 'Password Guessing',        tactic: 'TA0006' },
  { id: 'T1078', name: 'Valid Accounts',               tactic: 'TA0001' },
  { id: 'T1190', name: 'Exploit Public App',           tactic: 'TA0001' },
  { id: 'T1059', name: 'Command & Scripting',          tactic: 'TA0002' },
  { id: 'T1059.004', name: 'Unix Shell',               tactic: 'TA0002' },
  { id: 'T1505.003', name: 'Web Shell',                tactic: 'TA0003' },
  { id: 'T1136', name: 'Create Account',               tactic: 'TA0003' },
  { id: 'T1548', name: 'Abuse Elevation Control',      tactic: 'TA0004' },
  { id: 'T1070', name: 'Indicator Removal',            tactic: 'TA0005' },
  { id: 'T1083', name: 'File & Directory Discovery',   tactic: 'TA0007' },
  { id: 'T1087', name: 'Account Discovery',            tactic: 'TA0007' },
  { id: 'T1021', name: 'Remote Services',              tactic: 'TA0008' },
  { id: 'T1071', name: 'Application Layer Protocol',   tactic: 'TA0011' },
  { id: 'T1041', name: 'Exfil Over C2 Channel',        tactic: 'TA0010' },
  { id: 'T1499', name: 'Endpoint DoS',                 tactic: 'TA0040' }
]

export const techniqueById = (id: string): MitreTechnique | undefined =>
  TECHNIQUES.find((t) => t.id === id)

export const tacticById = (id: string): MitreTactic | undefined =>
  TACTICS.find((t) => t.id === id)
