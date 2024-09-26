import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { CorsConfig, NestConfig, SwaggerConfig } from './common/config/config.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const nestConfig = configService.get<NestConfig>('nest')
  const corsConfig = configService.get<CorsConfig>('cors')
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .build()
    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup(swaggerConfig.path, app, document)
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors()
  }

  await app.listen(nestConfig.port)

  Logger.log(`🚀 Application is running on: http://localhost:${nestConfig.port}`)
}
bootstrap()
