import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { sortBy, SortBy } from '../types/sortBy'

export class SearchTripDto {
  @ApiProperty()
  @IsString()
  origin: string

  @ApiProperty()
  @IsString()
  destination: string

  @ApiProperty()
  @IsIn(Object.keys(sortBy))
  @IsOptional()
  sort_by: SortBy
}
