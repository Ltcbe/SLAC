export default function DelayBadge({ seconds }: { seconds: number }) {
  const min = Math.round(seconds / 60)
  if (min <= 0) {
    return <span className="chip bg-green-100 text-green-800">à l'heure</span>
  }
  const tone = min <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
  return <span className={`chip ${tone}`}>+{min} min</span>
}
