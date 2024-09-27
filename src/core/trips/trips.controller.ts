import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { TripsService } from './trips.service'
import { SearchTripDto } from './dto/SearchTrip.dto'
import { ExternalTrip } from './models/trip.model'

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  @ApiOkResponse({
    type: ExternalTrip,
    isArray: true,
  })
  async search(@Query() query: SearchTripDto) {
    return this.tripsService.search(query)
  }
}
