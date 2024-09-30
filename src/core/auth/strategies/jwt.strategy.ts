import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '@core/auth/types/jwt-payload'
import { Model } from 'mongoose'
import { User } from '@core/users/schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { AuthConfig } from '@common/config/config.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    const authConfig = configService.get<AuthConfig>('auth')
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.userId)
    if (user) {
      return user
    }
    throw new UnauthorizedException()
  }
}
