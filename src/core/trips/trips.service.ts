import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { Trip } from './schemas/trip.schema'
import { TripProviderFactory } from './trip-provider.factory'
import { SearchTripDto } from './dto/SearchTrip.dto'
import { ExternalTrip } from './models/trip.model'
import { SaveTripDto } from './dto/SaveTrip.dto'
import { User } from '@core/users/schemas/user.schema'
import { TripsErrors } from './trips.constants'
import { PROVIDER } from './types/provider'
import { PaginateDto } from '@common/dto/paginate.dto'
import { PaginateResult } from '@common/models/paginate.model'

@Injectable()
export class TripsService {
  constructor(
    @InjectModel(Trip.name)
    private tripModel: PaginateModel<Trip>,
    private tripProviderFactory: TripProviderFactory,
  ) {}

  async search(query: SearchTripDto): Promise<ExternalTrip[]> {
    const provider = this.tripProviderFactory.getProvider(PROVIDER.bizaway)

    let trips: ExternalTrip[]

    try {
      trips = await provider.searchTrips(query)
    } catch (e) {
      throw new BadRequestException(TripsErrors.GENERIC)
    }

    return trips.map((el) => ({
      ...el,
      provider: PROVIDER.bizaway,
    }))
  }

  async save(body: SaveTripDto, user: User): Promise<Trip> {
    const provider = this.tripProviderFactory.getProvider(body.provider)

    let trip: ExternalTrip

    try {
      trip = await provider.getTrip(body.id)
    } catch (error) {
      throw new NotFoundException(TripsErrors.NOT_FOUND)
    }

    const tripUser = await this.tripModel.create({
      ...trip,
      external_id: trip.id,
      user: user._id,
      provider: body.provider,
    })

    return tripUser
  }

  async getUserTrips(query: PaginateDto, user: User): Promise<PaginateResult<Trip>> {
    return this.tripModel.paginate({ user: user._id }, { page: query.page, limit: query.limit })
  }

  async deleteTrip(id: string, user: User): Promise<void> {
    const trip = await this.tripModel.findOneAndDelete({ _id: id, user: user._id })

    if (!trip) {
      throw new NotFoundException(TripsErrors.NOT_FOUND)
    }
  }
}
