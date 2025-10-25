export type Stop = { name: string; time: number }
export type Trip = {
  id: number
  ext_id: string
  route_code: string
  departure_ts: number
  arrival_ts: number
  delay_sec: number
  status: string
  stops: Stop[]
}
