import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PaginateModel } from 'mongoose'
import { Airport } from './schemas/airport.schema'
import { PaginateDto } from 'src/common/dto/paginate.dto'

@Injectable()
export class AirportsService {
  constructor(
    @InjectModel(Airport.name)
    private airportModel: PaginateModel<Airport>,
  ) {}

  async findAll(query: PaginateDto) {
    return this.airportModel.paginate({}, { page: query.page, limit: query.limit })
  }
}
