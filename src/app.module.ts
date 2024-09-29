import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import config from './common/config'
import { AirportsModule, TripsModule } from './core'
import { MongoConfig } from './common/config/config.interface'
import { MongoExistValidator } from './common/validators/exist-on-mongo.validator'
import { UsersModule } from './core/users/users.module'
import { AuthModule } from './core/auth/auth.module'

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
