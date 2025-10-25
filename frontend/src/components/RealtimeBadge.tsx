export default function RealtimeBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${ok ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
      {ok ? 'Temps réel' : 'Offline'}
    </span>
  )
}
