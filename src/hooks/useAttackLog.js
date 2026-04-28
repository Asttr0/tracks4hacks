import { useEffect } from 'react';
import { useUiStore } from '@/store/useUiStore';
import { DEMO_ATTACKS } from '@/data/demo-attacks';
export function useAttackLog() {
    const setAttackLog = useUiStore((s) => s.setAttackLog);
    const demoMode = useUiStore((s) => s.demoMode);
    useEffect(() => {
        if (demoMode)
            setAttackLog(DEMO_ATTACKS);
    }, [demoMode, setAttackLog]);
}
