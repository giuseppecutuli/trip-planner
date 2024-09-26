import { Module } from '@nestjs/common'
import { BizawayProvider } from './bizaway.provider'

@Module({
  imports: [],
  providers: [BizawayProvider],
  exports: [BizawayProvider],
})
export class ProvidersModule {}
