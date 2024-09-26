import { SortBy } from '../types/sortBy'
import { Trip } from '../types/trip'

export type SearchTripsParams = {
  origin: string
  destination: string
  sort_by: SortBy
}

export abstract class TripProvider {
  abstract searchTrips(params: SearchTripsParams): Promise<Trip[]>
  abstract getTripById(id: string): Promise<Trip>
}
