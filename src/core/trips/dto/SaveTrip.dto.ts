import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString } from 'class-validator'
import { PROVIDER, Provider } from '../types/provider'

export class SaveTripDto {
  @ApiProperty()
  @IsIn(Object.keys(PROVIDER))
  provider: Provider

  @ApiProperty()
  @IsString()
  id: string
}
