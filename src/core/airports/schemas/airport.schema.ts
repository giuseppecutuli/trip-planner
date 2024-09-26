import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'

export type AirportDocument = HydratedDocument<Airport>

@Schema({ validateBeforeSave: true, timestamps: true })
export class Airport {
  @ApiProperty()
  @Prop()
  name: string

  @ApiProperty()
  @Prop({ required: true, unique: true })
  iata: string

  @ApiProperty()
  @Prop()
  city: string

  @ApiProperty()
  @Prop()
  state: string

  @ApiProperty()
  @Prop()
  country: string

  @ApiProperty()
  @Prop()
  latitude: number

  @ApiProperty()
  @Prop()
  longitude: number
}

const AirportSchema = SchemaFactory.createForClass(Airport)

AirportSchema.plugin(paginate)

export { AirportSchema }
