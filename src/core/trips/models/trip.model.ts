import { ApiProperty } from '@nestjs/swagger'
import { TripType } from '@core/trips/types/tripType'

export class ExternalTrip {
  @ApiProperty()
  id: string
  @ApiProperty()
  origin: string
  @ApiProperty()
  destination: string
  @ApiProperty()
  cost: number
  @ApiProperty()
  duration: number
  @ApiProperty()
  type: TripType
  @ApiProperty()
  display_name: string
  @ApiProperty()
  provider: string
}
