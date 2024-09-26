import { Injectable } from '@nestjs/common'
import { BizawayProvider } from './providers/bizaway.provider'

@Injectable()
export class TripProviderFactory {
  constructor(private bizawayProvider: BizawayProvider) {}

  getProvider(provider: string) {
    switch (provider) {
      case 'bizaway':
        return this.bizawayProvider
      default:
        throw new Error(`Unknown travel provider: ${provider}`)
    }
  }
}
