import type { AttackEvent } from '@/types/attack'

const base = Date.now() - 60 * 60 * 1000
const ts = (s: number) => new Date(base + s * 1000).toISOString()

export const DEMO_ATTACKS: AttackEvent[] = [
  { id: 'atk-1', timestamp: ts(0),   tool: 'nmap',     command: 'nmap -sV -T4 -p- 10.0.0.4',                                    target: '10.0.0.4', mitre: ['T1046', 'T1595'] },
  { id: 'atk-2', timestamp: ts(115), tool: 'hydra',    command: 'hydra -l root -P rockyou.txt ssh://10.0.0.4',                  target: '10.0.0.4', mitre: ['T1110', 'T1110.001'] },
  { id: 'atk-3', timestamp: ts(235), tool: 'gobuster', command: 'gobuster dir -u http://10.0.0.4 -w /usr/share/wordlists/dirb/common.txt', target: '10.0.0.4', mitre: ['T1083'] },
  { id: 'atk-4', timestamp: ts(350), tool: 'curl',     command: 'curl -X POST http://10.0.0.4/admin/upload -F shell.php=@shell.php', target: '10.0.0.4', mitre: ['T1190', 'T1505.003'] },
  { id: 'atk-5', timestamp: ts(495), tool: 'other',    command: 'sudo -l && sudo /bin/bash',                                    target: '10.0.0.4', mitre: ['T1548'] },
  { id: 'atk-6', timestamp: ts(598), tool: 'other',    command: 'useradd -m -s /bin/bash backdoor',                             target: '10.0.0.4', mitre: ['T1136'] },
  { id: 'atk-7', timestamp: ts(720), tool: 'sqlmap',   command: 'sqlmap -u http://10.0.0.4/search?q=1 --batch --dump',          target: '10.0.0.4', mitre: ['T1190'] }
]
