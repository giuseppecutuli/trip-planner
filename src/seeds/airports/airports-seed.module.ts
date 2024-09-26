import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AirportsSeedService } from './airports-seed.service'
import { Airport, AirportSchema } from 'src/core/airports/schemas/airport.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Airport.name,
        schema: AirportSchema,
      },
    ]),
  ],
  providers: [AirportsSeedService],
  exports: [AirportsSeedService],
})
export class AirportsSeedModule {}
