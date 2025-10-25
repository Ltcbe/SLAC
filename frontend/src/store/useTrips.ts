import { create } from 'zustand'
import type { Trip } from '../api/types'

type State = { items: Trip[]; lastEvent?: string }

type Actions = {
  set: (items: Trip[]) => void
  pushEvent: (evt: string) => void
}

export const useTrips = create<State & Actions>((set) => ({
  items: [],
  set: (items) => set({ items }),
  pushEvent: (evt) => set({ lastEvent: evt }),
}))
