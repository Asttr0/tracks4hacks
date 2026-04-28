export interface WazuhAlert {
  id: string
  timestamp: string
  rule: {
    id: string
    level: number
    description: string
    mitre?: { id?: string[]; tactic?: string[]; technique?: string[] }
    groups?: string[]
  }
  agent: { id?: string; name: string; ip?: string }
  decoder?: { name?: string }
  data?: {
    srcip?: string
    srcport?: string
    dstport?: string
    url?: string
    [k: string]: string | undefined
  }
  full_log?: string
}

export interface WazuhAgent {
  id: string
  name: string
  ip: string
  status: 'active' | 'disconnected' | 'pending' | 'never_connected'
  os?: { platform?: string; name?: string; version?: string }
}
