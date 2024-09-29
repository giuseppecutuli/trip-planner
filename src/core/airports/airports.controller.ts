import { Controller, Get, Query } from '@nestjs/common'
import { AirportsService } from './airports.service'
import { PaginateDto } from 'src/common/dto/paginate.dto'
import { ApiTags } from '@nestjs/swagger'
import { ApiPaginatedResponse } from 'src/common/utils/swagger'
import { Airport } from './schemas/airport.schema'

@ApiTags('Airports')
@Controller('airports')
export class AirportsController {
  constructor(private airportsService: AirportsService) {}

  @Get()
  @ApiPaginatedResponse(Airport)
  findAll(@Query() query: PaginateDto) {
    return this.airportsService.findAll(query)
  }
}
