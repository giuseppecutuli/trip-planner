import { NestFactory } from '@nestjs/core'
import { SeedsModule } from './seeds.module'
import { AirportsSeedService } from './airports/airports-seed.service'

const runSeed = async () => {
  const app = await NestFactory.create(SeedsModule, { logger: false })

  await app.get(AirportsSeedService).run()

  await app.close()
}

void runSeed()
