import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export class BaseModel extends Document {
  @ApiProperty()
  _id: string
  @ApiProperty()
  createdAt: Date
  @ApiProperty()
  updatedAt: Date
}
