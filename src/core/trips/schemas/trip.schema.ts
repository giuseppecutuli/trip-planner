import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose, { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { TripType } from '../types/tripType'
import { BaseModel } from 'src/common/models/base.model'
import { ExternalTrip } from '../models/trip.model'
import { User } from 'src/core/users/schemas/user.schema'

export type TripDocument = HydratedDocument<Trip>

@Schema({ validateBeforeSave: true, timestamps: true })
export class Trip extends BaseModel implements Omit<ExternalTrip, 'id'> {
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User
}

const TripSchema = SchemaFactory.createForClass(Trip)

TripSchema.plugin(paginate)

export { TripSchema }
