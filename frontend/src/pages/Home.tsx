import { useEffect, useMemo, useState } from 'react'
import { fetchTrips, ws } from '../api/client'
import TripCard from '../components/TripCard'
import Loading from '../components/Loading'
import FiltersBar from '../components/FiltersBar'
import RealtimeBadge from '../components/RealtimeBadge'
import { useTrips } from '../store/useTrips'

export default function Home() {
  const { items, set, pushEvent } = useTrips()
  const [loading, setLoading] = useState(true)
  const [ok, setOk] = useState(false)
  const [params, setParams] = useState<Record<string, any>>({ page: 1, page_size: 50 })

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
      // naïf: refetch à chaque event
      fetchTrips(params).then((r)=> set(r.items))
    }
    return () => socket.close()
  }, [params, pushEvent, set])

  const list = useMemo(()=> items, [items])

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SLAC</h1>
        <RealtimeBadge ok={ok} />
      </div>
      <FiltersBar onApply={(p)=> setParams((prev)=> ({...prev, ...p}))} />
      {loading ? <Loading/> : (
        <div className="grid md:grid-cols-2 gap-3">
          {list.map((t)=> <TripCard key={t.id} t={t} />)}
        </div>
      )}
    </div>
  )
}
