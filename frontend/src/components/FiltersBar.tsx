import { useState } from 'react'

type Props = {
  initial?: Record<string, string | number | undefined>
  onApply: (params: Record<string, string | number | undefined>) => void
}

export default function FiltersBar({ initial, onApply }: Props) {
  const [route, setRoute] = useState<string>(String(initial?.route_code ?? ''))
  const [status, setStatus] = useState<string>(String(initial?.status ?? ''))
  const [minDelay, setMinDelay] = useState<number | undefined>(initial?.min_delay as number | undefined)
  const [q, setQ] = useState<string>('')

  return (
    <div className="card p-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grow">
          <label className="block text-xs text-gray-500">Recherche</label>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="N° train, gare…" className="input w-full" />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Route</label>
          <input value={route} onChange={e=>setRoute(e.target.value)} className="input w-56" placeholder="BE...->BE..." />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Statut</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="select w-40">
            <option value="">(tous)</option>
            <option value="scheduled">scheduled</option>
            <option value="departed">departed</option>
            <option value="arrived">arrived</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Retard ≥ (sec)</label>
          <input type="number" value={minDelay ?? ''} onChange={e=>setMinDelay(e.target.value?Number(e.target.value):undefined)} className="input w-32" />
        </div>
        <button
          onClick={() => onApply({
            route_code: route || undefined,
            status: status || undefined,
            min_delay: minDelay,
            q: q || undefined,
            page: 1
          })}
          className="btn btn-primary"
        >
          Filtrer
        </button>
      </div>
    </div>
  )
}
