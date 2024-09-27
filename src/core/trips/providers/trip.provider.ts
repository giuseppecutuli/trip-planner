import { ExternalTrip } from '../models/trip.model'
import { SortBy } from '../types/sortBy'

export type SearchTripsParams = {
  origin: string
  destination: string
  sort_by: SortBy
}

export abstract class TripProvider {
  abstract searchTrips(params: SearchTripsParams): Promise<ExternalTrip[]>
  abstract getTripById(id: string): Promise<ExternalTrip>
}
