import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import config from './common/config'
import { AirportsModule, TripsModule, AuthModule, UsersModule } from './core'
import { MongoConfig } from './common/config/config.interface'
import { MongoExistValidator } from './common/validators/exist-on-mongo.validator'

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
    AirportsModule,
    TripsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [MongoExistValidator],
})
export class AppModule {}
