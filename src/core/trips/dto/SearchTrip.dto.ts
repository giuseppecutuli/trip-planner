import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { SORT_BY, SortBy } from '@core/trips/types/sortBy'
import { ExistOnMongo } from '@common/validators/exist-on-mongo.validator'

export class SearchTripDto {
  @ApiProperty()
  @IsString()
  @ExistOnMongo({ model: 'Airport', column: 'iata' })
  origin: string

  @ApiProperty()
  @IsString()
  @ExistOnMongo({ model: 'Airport', column: 'iata' })
  destination: string

  @ApiProperty()
  @IsIn(Object.keys(SORT_BY))
  @IsOptional()
  sort_by?: SortBy
}
