const base = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
export async function fetchTrips(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) q.set(k, String(v)) })
  const res = await fetch(`${base}/api/trips?${q.toString()}`)
  if (!res.ok) throw new Error('failed')
  return res.json() as Promise<{ items: import('./types').Trip[]; count: number }>
}
export function ws(): WebSocket {
  const wsBase = (import.meta.env.VITE_WS_BASE || 'ws://localhost:8000') + '/ws'
  return new WebSocket(wsBase)
}
