import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { jwtDecode, JwtPayload as JwtDecodePayload } from 'jwt-decode'
import { Model } from 'mongoose'
import { Token } from './models/token.model'
import { SignInDto } from './dtos/sign-in.dto'
import { AuthErrors, AuthMessages, RESET_TOKEN_DURATION } from './auth.constants'
import { PasswordService } from './password.service'
import { RefreshTokenDto } from './dtos/refresh-token.dto'
import { SignOutDto } from './dtos/sign-out.dto'
import { ForgotPasswordDto } from './dtos/forgot-password.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { JwtPayload } from './types/jwt-payload'
import { SignUpDto } from './dtos/sign-up.dto'
import { randomString } from 'src/common/utils'
import { AuthConfig } from 'src/common/config/config.interface'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../users/schemas/user.schema'

@Injectable()
export class AuthService {
  private readonly refreshTokenSecret: string
  private readonly refreshTokenExpireIn: string

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    const authConfig = this.configService.get<AuthConfig>('auth')
    this.refreshTokenSecret = authConfig.jwtRefreshSecret
    this.refreshTokenExpireIn = authConfig.jwtRefreshExpiresIn
  }

  async signIn(data: SignInDto): Promise<Token> {
    const user = await this.userModel.findOne({ email: data.email }, { password: 1 })

    if (!user) {
      throw new ConflictException(AuthErrors.SIGN_IN_INVALID_CREDENTIALS)
    }

    const isPasswordValid = await PasswordService.validatePassword(data.password, user.password)
    if (!isPasswordValid) {
      throw new ConflictException(AuthErrors.SIGN_IN_INVALID_CREDENTIALS)
    }

    const { accessToken, refreshToken, expirationDate } = await this.createTokens(user.id)

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expiration_date: expirationDate,
    }
  }

  async signUp(data: SignUpDto): Promise<Token> {
    const user = await this.userModel.findOne({ email: data.email })
    if (user) {
      throw new ConflictException(AuthErrors.SIGN_UP_EMAIL_ALREADY_EXISTS)
    }

    const hashedPassword = await PasswordService.hashPassword(data.password)

    const createdUser = await this.userModel.create({
      email: data.email,
      password: hashedPassword,
      first_name: data.first_name,
      last_name: data.last_name,
    })

    const { accessToken, refreshToken, expirationDate } = await this.createTokens(createdUser.id)

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expiration_date: expirationDate,
    }
  }

  async refreshToken(data: RefreshTokenDto): Promise<Token> {
    let jwtPayload: JwtPayload
    try {
      jwtPayload = this.jwtService.verify<JwtPayload>(data.token, {
        secret: this.refreshTokenSecret,
      })
    } catch (e) {
      throw new ConflictException(AuthErrors.REFRESH_TOKEN_INVALID)
    }
    const { userId } = jwtPayload

    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'refresh_tokens',
        match: { token: data.token },
      })
      .exec()

    if (!user) {
      throw new ConflictException(AuthErrors.REFRESH_TOKEN_NOT_FOUND)
    }

    const accessToken = await this.createAccessToken({ userId })
    const expirationDate = this.calculateExpirationDate(data.token)

    return {
      access_token: accessToken,
      refresh_token: data.token,
      expiration_date: expirationDate,
    }
  }

  async signOut(data: SignOutDto, user: User) {
    const { userId } = this.jwtService.verify<JwtPayload>(data.refresh_token, {
      secret: this.refreshTokenSecret,
    })

    if (userId !== user.id) {
      throw new ConflictException(AuthErrors.REFRESH_TOKEN_INVALID)
    }

    await this.userModel.updateOne({ _id: userId }, { $pull: { refresh_tokens: { token: data.refresh_token } } }).exec()
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: data.email })
    if (!user) {
      throw new NotFoundException(AuthErrors.FORGOT_PASSWORD_USER_NOT_FOUND)
    }

    const expireAt = new Date()
    expireAt.setHours(expireAt.getHours() + RESET_TOKEN_DURATION)

    user.reset_token = randomString(12)
    user.reset_token_expiration = expireAt
    await user.save()

    return AuthMessages.RESET_TOKEN_SENT
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userModel.findOne({ reset_token: data.token, reset_token_expiration: { $gte: new Date() } })

    if (!user) {
      throw new NotFoundException(AuthErrors.RESET_PASSWORD_TOKEN_NOT_VALID)
    }

    const hashedPassword = await PasswordService.hashPassword(data.password)

    user.reset_token = null
    user.reset_token_expiration = null
    user.password = hashedPassword
    await user.save()
  }

  private async createTokens(userId: number) {
    const accessToken = await this.createAccessToken({ userId })
    const { token: refreshToken, expirationDate } = await this.createRefreshToken({ userId })
    return { accessToken, refreshToken, expirationDate }
  }

  private async createAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload)
  }

  private async createRefreshToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpireIn,
    })
    const expirationDate = this.calculateExpirationDate(token)
    await this.userModel
      .updateOne({ _id: payload.userId }, { $push: { refresh_tokens: { token, expiration_date: expirationDate } } })
      .exec()

    return { token, expirationDate }
  }

  private calculateExpirationDate(token: string) {
    const { exp } = jwtDecode<JwtDecodePayload>(token)
    const expirationDate = new Date(0)
    expirationDate.setUTCSeconds(exp || 0)
    return expirationDate
  }
}
