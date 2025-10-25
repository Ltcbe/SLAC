import { useEffect, useMemo, useState } from 'react'
import { fetchTrips, ws } from '../api/client'
import { useTrips } from '../store/useTrips'
import TripList from '../components/TripList'
import FiltersBar from '../components/FiltersBar'
import TripDetailsDrawer from '../components/TripDetailsDrawer'
import { RealtimeBadge } from '../components/Badge'

export default function Home() {
  const { items, set, pushEvent } = useTrips()
  const [loading, setLoading] = useState(true)
  const [ok, setOk] = useState(false)
  const [params, setParams] = useState<Record<string, any>>({ page: 1, page_size: 50 })
  const [open, setOpen] = useState<import('../api/types').Trip | undefined>()

  useEffect(() => {
    setLoading(true)
    fetchTrips(params).then((r)=> set(r.items)).finally(()=> setLoading(false))
  }, [params, set])

  useEffect(() => {
    const socket = ws()
    socket.onopen = () => setOk(true)
    socket.onclose = () => setOk(false)
    socket.onmessage = (evt) => {
      pushEvent(evt.data)
      // refresh simple
      fetchTrips(params).then((r)=> set(r.items))
    }
    return () => socket.close()
  }, [params, pushEvent, set])

  const list = useMemo(()=> items, [items])

  return (
    <div className="container-page space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Trajets • Live</h1>
        <RealtimeBadge ok={ok} />
      </div>

      <FiltersBar initial={params} onApply={(p)=> setParams((prev)=> ({...prev, ...p}))} />

      {loading ? (
        <div className="card p-6">Chargement…</div>
      ) : (
        <TripList items={list} onOpen={setOpen} />
      )}

      <TripDetailsDrawer trip={open} onClose={()=>setOpen(undefined)} />
    </div>
  )
}
