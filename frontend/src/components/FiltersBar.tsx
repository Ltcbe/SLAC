import { useState } from 'react'

export type Filters = {
  route_code?: string
  status?: string
  min_delay?: number
  max_delay?: number
}

export default function FiltersBar({ onApply }: { onApply: (p: Filters) => void }) {
  const [route, setRoute] = useState('')
  const [status, setStatus] = useState('')
  const [minDelay, setMinDelay] = useState<number | undefined>()
  const [maxDelay, setMaxDelay] = useState<number | undefined>()

  return (
    <div className="card p-3 flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-gray-500">Route</label>
        <input value={route} onChange={e=>setRoute(e.target.value)} className="border rounded-lg px-3 py-2 w-56" placeholder="BE...->BE..." />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Statut</label>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">(tous)</option>
          <option value="scheduled">scheduled</option>
          <option value="departed">departed</option>
          <option value="arrived">arrived</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500">Retard min (sec)</label>
        <input type="number" value={minDelay ?? ''} onChange={e=>setMinDelay(e.target.value?Number(e.target.value):undefined)} className="border rounded-lg px-3 py-2 w-32" />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Retard max (sec)</label>
        <input type="number" value={maxDelay ?? ''} onChange={e=>setMaxDelay(e.target.value?Number(e.target.value):undefined)} className="border rounded-lg px-3 py-2 w-32" />
      </div>
      <button onClick={()=>onApply({
        route_code: route || undefined,
        status: status || undefined,
        min_delay: minDelay,
        max_delay: maxDelay
      })} className="btn">
        Appliquer
      </button>
    </div>
  )
}
