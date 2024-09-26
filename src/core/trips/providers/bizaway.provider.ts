import { Injectable } from '@nestjs/common'
import { SearchTripsParams, TripProvider } from './trip.provider'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { TripProviderConfig } from 'src/common/config/config.interface'
import { Trip } from '../types/trip'
import { sortBy } from '../types/sortBy'

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
    const response = await this.httpService.get<Trip[]>('/trips', { params })
    const data = response.data

    const sortCheapest = (a: Trip, b: Trip) => a.cost - b.cost
    const sortFastest = (a: Trip, b: Trip) => a.duration - b.duration

    switch (params.sort_by) {
      case sortBy.cheapest:
        data.sort(sortCheapest)
        break
      case sortBy.fastest:
        data.sort(sortFastest)
        break
    }

    return data
  }

  async getTripById(id: string) {
    console.log(id)
    return {} as any
  }
}
