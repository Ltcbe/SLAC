import type { Trip } from '../api/types'
import TripCard from './TripCard'
import EmptyState from './EmptyState'

export default function TripList({ items, onOpen }: { items: Trip[]; onOpen: (t: Trip)=>void }) {
  if (!items?.length) return <EmptyState title="Aucun trajet trouvé" hint="Modifie les filtres ou réessaie plus tard." />
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map(t => <TripCard key={t.id} t={t} onOpen={onOpen} />)}
    </div>
  )
}
