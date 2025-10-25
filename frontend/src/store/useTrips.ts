import { create } from 'zustand'
import type { Trip } from '../api/types'

type State = {
  items: Trip[]
  selectedIds: number[]
  lastEvent?: string
  loading: boolean
  error?: string
}

type Actions = {
  set: (items: Trip[]) => void
  pushEvent: (evt: string) => void
  select: (id: number) => void
  unselect: (id: number) => void
  clearSelection: () => void
  setLoading: (v: boolean) => void
  setError: (e?: string) => void
}

export const useTrips = create<State & Actions>((set, get) => ({
  items: [],
  selectedIds: [],
  loading: true,
  set: (items) => set({ items }),
  pushEvent: (evt) => set({ lastEvent: evt }),
  select: (id) => set({ selectedIds: Array.from(new Set([...get().selectedIds, id])) }),
  unselect: (id) => set({ selectedIds: get().selectedIds.filter(x => x !== id) }),
  clearSelection: () => set({ selectedIds: [] }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
}))
