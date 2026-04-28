import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLogStore } from '@/store/useLogStore';
import { useUiStore } from '@/store/useUiStore';
import { DEMO_ALERTS } from '@/data/demo-alerts';
async function fetchAlerts() {
    const r = await fetch('/api/wazuh-alerts?limit=500');
    if (!r.ok)
        throw new Error(`alerts_http_${r.status}`);
    const body = (await r.json());
    if (Array.isArray(body))
        return body;
    return body.data?.affected_items ?? [];
}
export function useAlertsQuery() {
    const demoMode = useUiStore((s) => s.demoMode);
    const setAlerts = useLogStore((s) => s.setAlerts);
    const mergeAlerts = useLogStore((s) => s.mergeAlerts);
    const q = useQuery({
        queryKey: ['alerts'],
        queryFn: fetchAlerts,
        enabled: !demoMode
    });
    useEffect(() => {
        if (demoMode)
            setAlerts(DEMO_ALERTS);
    }, [demoMode, setAlerts]);
    useEffect(() => {
        if (!demoMode && q.data)
            mergeAlerts(q.data);
    }, [demoMode, q.data, mergeAlerts]);
    return q;
}
