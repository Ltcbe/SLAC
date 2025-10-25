// API relative par défaut -> /api (proxy Nginx). Pas besoin de VITE_* en prod.
const apiBase = (import.meta.env.VITE_API_BASE as string | undefined) ?? '';

export async function fetchTrips(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) q.set(k, String(v)) });
  const prefix = apiBase || '';
  const res = await fetch(`${prefix}/api/trips?${q.toString()}`);
  if (!res.ok) throw new Error('failed');
  return res.json() as Promise<{ items: import('./types').Trip[]; count: number }>;
}

export function ws(): WebSocket {
  const envWs = (import.meta.env.VITE_WS_BASE as string | undefined);
  if (envWs && envWs.trim().length > 0) {
    return new WebSocket(`${envWs}/ws`);
  }
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  return new WebSocket(`${proto}://${location.host}/ws`);
}
