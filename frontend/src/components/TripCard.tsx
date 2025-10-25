import type { Trip } from '../api/types'
import StatusPill from './StatusPill'
import { DelayBadge } from './Badge'

export default function TripCard({ t, onOpen }: { t: Trip; onOpen: (t: Trip) => void }) {
  const d = new Date(t.departure_ts * 1000)
  const a = new Date(t.arrival_ts * 1000)
  const dep = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const arr = a.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <button onClick={()=>onOpen(t)} className="card w-full text-left p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{t.route_code}</div>
        <div className="flex items-center gap-2">
          <DelayBadge delaySec={t.delay_sec} />
          <StatusPill status={t.status} />
        </div>
      </div>
      <div className="mt-1 text-2xl font-semibold">{dep} → {arr}</div>
      {t.stops?.length ? (
        <div className="mt-2 text-sm text-gray-600 line-clamp-1">
          {t.stops.map(s => s.name).join(' · ')}
        </div>
      ) : null}
    </button>
  )
}
