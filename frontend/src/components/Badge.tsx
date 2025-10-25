export function DelayBadge({ delaySec }: { delaySec: number }) {
  const min = Math.round(delaySec / 60)
  if (min <= 0) return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">à l’heure</span>
  if (min <= 5) return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">+{min} min</span>
  return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">+{min} min</span>
}

export function RealtimeBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${ok ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
      {ok ? 'Temps réel' : 'Offline'}
    </span>
  )
}
