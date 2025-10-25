import type { Trip } from '../api/types'
import StatusPill from './StatusPill'
import { DelayBadge } from './Badge'

export default function TripDetailsDrawer({ trip, onClose }: { trip?: Trip; onClose: ()=>void }) {
  return (
    <div className={`fixed inset-0 z-40 ${trip ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* backdrop */}
      <div onClick={onClose} className={`absolute inset-0 bg-black/30 transition-opacity ${trip ? 'opacity-100' : 'opacity-0'}`} />
      {/* panel */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-4 transition-transform ${trip ? 'translate-x-0' : 'translate-x-full'}`}>
        {trip && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{trip.route_code}</div>
                <div className="text-2xl font-semibold">
                  {new Date(trip.departure_ts*1000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                  {' → '}
                  {new Date(trip.arrival_ts*1000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
              <button onClick={onClose} className="btn btn-ghost">Fermer</button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <DelayBadge delaySec={trip.delay_sec} />
              <StatusPill status={trip.status} />
            </div>
            <div className="mt-4">
              <div className="font-medium mb-2">Arrêts</div>
              <ol className="space-y-2">
                {trip.stops?.map((s,i)=> (
                  <li key={i} className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm">{s.name}</span>
                    <span className="text-sm text-gray-500">{new Date(s.time*1000).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
