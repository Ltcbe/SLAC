import type { Trip } from '../api/types'

export default function TripCard({ t }: { t: Trip }) {
  const d = new Date(t.departure_ts * 1000)
  const a = new Date(t.arrival_ts * 1000)
  const delayMin = Math.round(t.delay_sec/60)
  return (
    <div className="rounded-2xl shadow p-4 border">
      <div className="text-sm text-gray-500">{t.route_code}</div>
      <div className="font-semibold text-lg">{d.toLocaleTimeString()} → {a.toLocaleTimeString()}</div>
      <div className={delayMin>0? 'text-red-600':'text-green-700'}>
        {delayMin>0? `+${delayMin} min` : "à l'heure"} · {t.status}
      </div>
      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-gray-600">Arrêts ({t.stops.length})</summary>
        <ul className="text-sm mt-1 list-disc ml-5">
          {t.stops.map((s,i)=> <li key={i}>{s.name} – {new Date(s.time*1000).toLocaleTimeString()}</li>)}
        </ul>
      </details>
    </div>
  )
}
