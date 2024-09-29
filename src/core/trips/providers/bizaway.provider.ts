import { Injectable } from '@nestjs/common'
import { SearchTripsParams, TripProvider } from './trip.provider'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { TripProviderConfig } from 'src/common/config/config.interface'
import { SORT_BY } from '../types/sortBy'
import { ExternalTrip } from '../models/trip.model'

@Injectable()
export class BizawayProvider implements TripProvider {
  httpService: AxiosInstance

  constructor(private configService: ConfigService) {
    const config = this.configService.get<TripProviderConfig>('tripProviders.bizaway')
    this.httpService = axios.create({
      baseURL: config.url,
      headers: {
        'x-api-key': config.apiKey,
      },
    })
  }

  async searchTrips(params: SearchTripsParams) {
    const response = await this.httpService.get<ExternalTrip[]>('/trips', { params })
    const data = response.data

    const sortCheapest = (a: ExternalTrip, b: ExternalTrip) => a.cost - b.cost
    const sortFastest = (a: ExternalTrip, b: ExternalTrip) => a.duration - b.duration

    switch (params.sort_by) {
      case SORT_BY.cheapest:
        data.sort(sortCheapest)
        break
      case SORT_BY.fastest:
        data.sort(sortFastest)
        break
    }

    return data
  }

  async getTrip(id: string) {
    const response = await this.httpService.get<ExternalTrip>(`/trips/${id}`)

    return response.data
  }
}
