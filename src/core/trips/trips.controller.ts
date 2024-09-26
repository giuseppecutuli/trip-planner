import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { TripsService } from './trips.service'
import { SearchTripDto } from './dto/SearchTrip.dto'

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  async search(@Query() query: SearchTripDto) {
    return this.tripsService.search(query)
  }
}
