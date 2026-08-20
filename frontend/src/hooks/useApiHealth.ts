import { useEffect, useState } from 'react'
import { checkHealth } from '../services/api'

/**
 * Poll the backend health endpoint so the header can show a live
 * API Online / Offline indicator. Returns the boolean status.
 */
export function useApiHealth(intervalMs = 30000) {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const health = await checkHealth()
        if (!cancelled) setOnline(health.status === 'healthy')
      } catch {
        if (!cancelled) setOnline(false)
      }
    }

    void check()
    const timer = setInterval(check, intervalMs)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [intervalMs])

  return online
}
