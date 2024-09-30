import { ExternalTrip } from '@core/trips/models/trip.model'
import { SORT_BY, SortBy } from '@core/trips/types/sortBy'

export type SearchTripsParams = {
  origin: string
  destination: string
  sort_by?: SortBy
}

export abstract class TripProvider {
  abstract searchTrips(params: SearchTripsParams): Promise<ExternalTrip[]>
  abstract getTrip(id: string): Promise<ExternalTrip>

  protected sortCheapest(a: ExternalTrip, b: ExternalTrip) {
    return a.cost - b.cost
  }

  protected sortFastest(a: ExternalTrip, b: ExternalTrip) {
    return a.duration - b.duration
  }

  protected sortTrips(trips: ExternalTrip[], sortBy: SortBy): ExternalTrip[] {
    switch (sortBy) {
      case SORT_BY.cheapest:
        trips.sort(this.sortCheapest)
        break
      case SORT_BY.fastest:
        trips.sort(this.sortFastest)
        break
    }

    return trips
  }
}
