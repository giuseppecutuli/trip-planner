export interface Config {
  nest: NestConfig
  cors: CorsConfig
  swagger: SwaggerConfig
  security: SecurityConfig
  mongo: MongoConfig
  tripProviders: Record<string, TripProviderConfig>
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

export interface SecurityConfig {
  expiresIn: string
  refreshIn: string
  bcryptSaltOrRound: string | number
}

export interface TripProviderConfig {
  url: string
  apiKey: string
}
