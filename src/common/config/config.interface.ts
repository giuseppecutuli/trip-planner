export interface Config {
  nest: NestConfig
  cors: CorsConfig
  swagger: SwaggerConfig
  mongo: MongoConfig
  auth: AuthConfig
  tripProviders: Record<string, TripProviderConfig>
}

export interface AuthConfig {
  jwtSecret: string
  jwtExpiresIn: string
  jwtRefreshSecret: string
  jwtRefreshExpiresIn: string
}

export interface NestConfig {
  port: number
}

export interface MongoConfig {
  uri: string
}

export interface CorsConfig {
  enabled: boolean
}

export interface SwaggerConfig {
  enabled: boolean
  title: string
  description: string
  version: string
  path: string
}

export interface TripProviderConfig {
  url: string
  apiKey: string
}
