import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'

export type RefreshTokenDocument = HydratedDocument<RefreshToken>

@Schema({ validateBeforeSave: true, timestamps: true })
export class RefreshToken {
  @ApiProperty()
  @Prop({ required: true })
  token: string

  @ApiProperty()
  @Prop({ type: Date, required: true })
  expiration_date: Date
}

const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)

export { RefreshTokenSchema }
