import { useEffect } from 'react'
import type { WazuhAlert } from '@/types/wazuh'
import { useLogStore } from '@/store/useLogStore'
import { useUiStore } from '@/store/useUiStore'

export function useAlertStream() {
  const demoMode = useUiStore((s) => s.demoMode)
  const mergeAlerts = useLogStore((s) => s.mergeAlerts)

  useEffect(() => {
    if (demoMode) return
    const es = new EventSource('/api/stream')
    es.addEventListener('alerts', (e: MessageEvent) => {
      try {
        const items = JSON.parse(e.data) as WazuhAlert[]
        mergeAlerts(items)
      } catch { /* ignore */ }
    })
    return () => es.close()
  }, [demoMode, mergeAlerts])
}
