export const tripTypes = {
  flight: 'flight',
  train: 'train',
  car: 'car',
  bus: 'bus',
} as const

export type TripType = keyof typeof tripTypes

export type Trip = {
  origin: string
  destination: string
  cost: number
  duration: number
  type: TripType
  display_name: string
}
