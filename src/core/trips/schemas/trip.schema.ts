import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { Trip as TTrip, TripType } from '../types/trip'

export type TripDocument = HydratedDocument<Trip>

@Schema({ validateBeforeSave: true, timestamps: true })
export class Trip implements TTrip {
  @ApiProperty()
  @Prop()
  origin: string

  @ApiProperty()
  @Prop()
  destination: string

  @ApiProperty()
  @Prop()
  cost: number

  @ApiProperty()
  @Prop()
  duration: number

  @ApiProperty()
  @Prop({ type: String })
  type: TripType

  @ApiProperty()
  @Prop()
  display_name: string

  @ApiProperty()
  @Prop()
  external_id: string

  @ApiProperty()
  @Prop()
  provider: string
}

const TripSchema = SchemaFactory.createForClass(Trip)

TripSchema.plugin(paginate)

export { TripSchema }
