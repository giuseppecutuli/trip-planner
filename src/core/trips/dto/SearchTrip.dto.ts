import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { sortBy, SortBy } from '../types/sortBy'
import { ExistOnMongo } from 'src/common/validators/exist-on-mongo.validator'

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
  @IsIn(Object.keys(sortBy))
  @IsOptional()
  sort_by: SortBy
}
