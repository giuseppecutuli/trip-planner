import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { Trip } from './schemas/trip.schema'
import { TripProviderFactory } from './trip-provider.factory'
import { SearchTripDto } from './dto/SearchTrip.dto'

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name)
    private tripModel: PaginateModel<Trip>,
    private tripProviderFactory: TripProviderFactory,
  ) {}

  async search(query: SearchTripDto) {
    const provider = this.tripProviderFactory.getProvider('bizaway')

    return provider.searchTrips(query)
  }
}
