import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard'

export const UseAuth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth(), ApiUnauthorizedResponse({ description: 'Unauthorized' }))
}
