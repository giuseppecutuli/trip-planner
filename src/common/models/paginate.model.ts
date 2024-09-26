import { ApiProperty } from '@nestjs/swagger'

export class PaginateModel<T> {
  @ApiProperty()
  totalDocs: number
  @ApiProperty()
  limit: number
  @ApiProperty()
  page: number
  @ApiProperty()
  pagingCounter: number
  @ApiProperty()
  hasPrevPage: boolean
  @ApiProperty()
  hasNextPage: boolean
  @ApiProperty()
  prevPage: string | null
  @ApiProperty()
  nextPage: string | null

  data: T[]
}
