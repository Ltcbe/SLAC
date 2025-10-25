export default function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: 'bg-gray-100 text-gray-700',
    departed:  'bg-blue-100 text-blue-800',
    arrived:   'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700'
  }
  return <span className={`chip ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>{status}</span>
}
