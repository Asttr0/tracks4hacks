import { useEffect } from 'react';
import { useLogStore } from '@/store/useLogStore';
import { useUiStore } from '@/store/useUiStore';
export function useAlertStream() {
    const demoMode = useUiStore((s) => s.demoMode);
    const mergeAlerts = useLogStore((s) => s.mergeAlerts);
    useEffect(() => {
        if (demoMode)
            return;
        const es = new EventSource('/api/stream');
        es.addEventListener('alerts', (e) => {
            try {
                const items = JSON.parse(e.data);
                mergeAlerts(items);
            }
            catch { /* ignore */ }
        });
        return () => es.close();
    }, [demoMode, mergeAlerts]);
}
