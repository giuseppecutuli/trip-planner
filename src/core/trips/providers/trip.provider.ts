import { ExternalTrip } from '@core/trips/models/trip.model'
import { SortBy } from '@core/trips/types/sortBy'

export type SearchTripsParams = {
  origin: string
  destination: string
  sort_by: SortBy
}

export abstract class TripProvider {
  abstract searchTrips(params: SearchTripsParams): Promise<ExternalTrip[]>
  abstract getTrip(id: string): Promise<ExternalTrip>
}
