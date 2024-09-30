import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { TripsService } from './trips.service'
import { SearchTripDto } from './dto/SearchTrip.dto'
import { ExternalTrip } from './models/trip.model'
import { SaveTripDto } from './dto/SaveTrip.dto'
import { UseAuth } from '@core/auth/decorators/auth.decorator'
import { UseUser } from '@core/auth/decorators/user.decorator'
import { User } from '@core/users/schemas/user.schema'
import { Trip } from './schemas/trip.schema'
import { PaginateDto } from '@common/dto/paginate.dto'
import { ApiPaginatedResponse } from '@common/utils/swagger'

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get('search')
  @ApiOkResponse({
    type: ExternalTrip,
    isArray: true,
  })
  async search(@Query() query: SearchTripDto) {
    return this.tripsService.search(query)
  }

  @Post('save')
  @UseAuth()
  async save(@Body() body: SaveTripDto, @UseUser() user: User) {
    return this.tripsService.save(body, user)
  }

  @Get()
  @UseAuth()
  @ApiPaginatedResponse(Trip)
  async getUserTrips(@Query() query: PaginateDto, @UseUser() user: User) {
    return this.tripsService.getUserTrips(query, user)
  }

  @Delete(':id')
  @UseAuth()
  async deleteTrip(@Param('id') id: string, @UseUser() user: User) {
    return this.tripsService.deleteTrip(id, user)
  }
}
