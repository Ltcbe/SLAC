import { useState } from 'react'

export default function FiltersBar({ onApply }: { onApply: (p: Record<string, string | number | undefined>) => void }) {
  const [route, setRoute] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [minDelay, setMinDelay] = useState<number | undefined>()

  return (
    <div className="flex gap-2 items-end flex-wrap">
      <div>
        <label className="block text-xs">Route</label>
        <input value={route} onChange={e=>setRoute(e.target.value)} className="border rounded px-2 py-1" placeholder="BE...->BE..." />
      </div>
      <div>
        <label className="block text-xs">Statut</label>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-2 py-1">
          <option value="">(tous)</option>
          <option value="scheduled">scheduled</option>
          <option value="departed">departed</option>
          <option value="arrived">arrived</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-xs">Retard ≥ (sec)</label>
        <input type="number" value={minDelay ?? ''} onChange={e=>setMinDelay(e.target.value?Number(e.target.value):undefined)} className="border rounded px-2 py-1 w-32" />
      </div>
      <button onClick={()=>onApply({route_code: route || undefined, status: status || undefined, min_delay: minDelay})} className="bg-black text-white rounded px-3 py-1">
        Appliquer
      </button>
    </div>
  )
}
