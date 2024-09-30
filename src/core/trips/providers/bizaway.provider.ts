import { Injectable } from '@nestjs/common'
import { SearchTripsParams, TripProvider } from './trip.provider'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'
import { TripProviderConfig } from '@common/config/config.interface'
import { ExternalTrip } from '@core/trips/models/trip.model'

@Injectable()
export class BizawayProvider extends TripProvider {
  httpService: AxiosInstance

  constructor(private configService: ConfigService) {
    super()

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
    const data = this.sortTrips(response.data, params.sort_by)

    return data
  }

  async getTrip(id: string) {
    const response = await this.httpService.get<ExternalTrip>(`/trips/${id}`)

    return response.data
  }
}
