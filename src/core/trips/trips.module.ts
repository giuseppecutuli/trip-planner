import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Trip, TripSchema } from './schemas/trip.schema'
import { TripsController } from './trips.controller'
import { TripsService } from './trips.service'
import { ProvidersModule } from './providers/providers.module'
import { TripProviderFactory } from './trip-provider.factory'

@Module({
  imports: [MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]), ProvidersModule],
  controllers: [TripsController],
  providers: [TripsService, TripProviderFactory],
})
export class TripsModule {}
