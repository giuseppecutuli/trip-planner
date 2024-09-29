export const TRIP_TYPE = {
  flight: 'flight',
  train: 'train',
  car: 'car',
  bus: 'bus',
} as const

export type TripType = keyof typeof TRIP_TYPE
