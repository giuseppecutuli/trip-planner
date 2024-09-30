import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import config from '@common/config'
import { MongoConfig } from '@common/config/config.interface'

import { AirportsSeedModule } from './airports/airports-seed.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoConfig = configService.get<MongoConfig>('mongo')

        return {
          uri: mongoConfig.uri,
        }
      },
    }),
    AirportsSeedModule,
  ],
  controllers: [],
  providers: [],
})
export class SeedsModule {}
