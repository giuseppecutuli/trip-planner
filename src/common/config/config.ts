import { getOsEnv, getOsEnvNumber } from '../utils/env'
import type { Config } from './config.interface'

export default (): Config => ({
  nest: {
    port: getOsEnvNumber('port', 3000),
  },
  cors: {
    enabled: true,
  },
  mongo: {
    uri: getOsEnv('MONGO_URI'),
  },
  swagger: {
    enabled: true,
    title: 'Trip Planner API',
    description: 'Trip Planner Swapper Documentation',
    version: '1.0',
    path: 'api',
  },
  security: {
    expiresIn: '1d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  tripProviders: {
    bizaway: {
      url: getOsEnv('BIZAWAY_TRIP_API_URL'),
      apiKey: getOsEnv('BIZAWAY_TRIP_API_KEY'),
    },
  },
})
