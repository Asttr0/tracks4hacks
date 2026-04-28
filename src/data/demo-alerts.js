const base = Date.now() - 60 * 60 * 1000;
const ts = (s) => new Date(base + s * 1000).toISOString();
export const DEMO_ALERTS = [
    {
        id: 'a1', timestamp: ts(5),
        rule: { id: '40101', level: 6, description: 'Port scan detected', mitre: { id: ['T1046'], tactic: ['Discovery'] }, groups: ['ids', 'suricata'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '185.220.101.45' }
    },
    {
        id: 'a2', timestamp: ts(12),
        rule: { id: '40102', level: 5, description: 'Nmap service-version probe', mitre: { id: ['T1595'] }, groups: ['ids'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '185.220.101.45' }
    },
    {
        id: 'a3', timestamp: ts(120),
        rule: { id: '5710', level: 10, description: 'sshd: authentication failure (multiple)', mitre: { id: ['T1110', 'T1110.001'] }, groups: ['authentication_failures', 'syslog'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '193.163.125.12' }
    },
    {
        id: 'a4', timestamp: ts(125),
        rule: { id: '5712', level: 10, description: 'sshd: brute force trying to get access to the system', mitre: { id: ['T1110'] }, groups: ['authentication_failures'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '193.163.125.12' }
    },
    {
        id: 'a5', timestamp: ts(240),
        rule: { id: '31151', level: 5, description: 'Multiple web server 404 error codes from same source IP', mitre: { id: ['T1083'] }, groups: ['web', 'apache'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '45.95.147.236', url: '/admin/login.php' }
    },
    {
        id: 'a6', timestamp: ts(244),
        rule: { id: '31153', level: 6, description: 'Directory enumeration detected', mitre: { id: ['T1083', 'T1595'] }, groups: ['web'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '45.95.147.236' }
    },
    {
        id: 'a7', timestamp: ts(355),
        rule: { id: '31106', level: 6, description: 'A web attack returned code 200 (success).', mitre: { id: ['T1190'] }, groups: ['web', 'attack'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' },
        data: { srcip: '45.95.147.236', url: '/admin/shell.php' }
    },
    {
        id: 'a8', timestamp: ts(410),
        rule: { id: '554', level: 8, description: 'New file added to the system (possible web shell)', mitre: { id: ['T1505.003'] }, groups: ['syscheck'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' }
    },
    {
        id: 'a9', timestamp: ts(500),
        rule: { id: '5402', level: 7, description: 'sudo: user privilege elevation', mitre: { id: ['T1548'] }, groups: ['syslog'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' }
    },
    {
        id: 'a10', timestamp: ts(600),
        rule: { id: '2902', level: 8, description: 'New user added to system', mitre: { id: ['T1136'] }, groups: ['syslog'] },
        agent: { name: 'home-lab', ip: '10.0.0.4' }
    }
];
