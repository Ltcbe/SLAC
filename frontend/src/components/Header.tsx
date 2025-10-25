import RealtimeBadge from './RealtimeBadge'

export default function Header({ ok }: { ok: boolean }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">S</div>
          <h1 className="text-xl md:text-2xl font-bold">SLAC — Trajets SNCB</h1>
        </div>
        <RealtimeBadge ok={ok} />
      </div>
    </header>
  )
}
