export const tripTypes = {
  flight: 'flight',
  train: 'train',
  car: 'car',
  bus: 'bus',
} as const

export type TripType = keyof typeof tripTypes
