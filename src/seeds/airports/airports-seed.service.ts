import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { Airport } from '@core/airports/schemas/airport.schema'
import * as airports from './airports.json'

@Injectable()
export class AirportsSeedService {
  constructor(
    @InjectModel(Airport.name)
    private airportModel: PaginateModel<Airport>,
  ) {}

  async run() {
    console.log('Seeding airports...')
    await this.airportModel.create(airports)
    console.log('Airports seeded.')
  }
}
