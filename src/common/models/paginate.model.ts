import { ApiProperty } from '@nestjs/swagger'
import { PaginateResult as PaginateResultMongo } from 'mongoose'

export class PaginateResult<T> implements PaginateResultMongo<T> {
  @ApiProperty()
  totalPages: number
  @ApiProperty()
  offset: number
  @ApiProperty()
  totalDocs: number
  @ApiProperty()
  limit: number
  @ApiProperty()
  page?: number | undefined
  @ApiProperty()
  pagingCounter: number
  @ApiProperty()
  hasPrevPage: boolean
  @ApiProperty()
  hasNextPage: boolean
  @ApiProperty()
  prevPage?: number | null | undefined
  @ApiProperty()
  nextPage?: number | null | undefined

  docs: T[];
  [customLabel: string]: number | boolean | T[]
  meta?: any
}
