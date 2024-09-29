import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { HydratedDocument, Document } from 'mongoose'
import { RefreshToken, RefreshTokenSchema } from 'src/core/auth/schemas/refresh-token.schema'

export type UserDocument = HydratedDocument<User>

@Schema({ validateBeforeSave: true, timestamps: true })
export class User extends Document {
  @ApiProperty()
  @Prop()
  first_name: string

  @ApiProperty()
  @Prop()
  last_name: string

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true, select: false })
  password: string

  @Prop({ type: [RefreshTokenSchema], select: false })
  refresh_tokens: RefreshToken[]

  @Prop({ select: false })
  reset_token?: string

  @Prop({ type: Date, select: false })
  reset_token_expiration?: Date
}

const UserSchema = SchemaFactory.createForClass(User)

export { UserSchema }
