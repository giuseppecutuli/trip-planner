import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from './password.service'
import { User } from '@core/users/schemas/user.schema'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { AuthMessages } from './auth.constants'
import { Model } from 'mongoose'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

describe('AuthService', () => {
  let authService: AuthService
  let userModel: Model<User>
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              jwtRefreshSecret: 'refreshSecret',
              jwtRefreshExpiresIn: '1d',
            }),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            updateOne: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue({}),
            }),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userModel = module.get<Model<User>>(getModelToken(User.name))
    jwtService = module.get<JwtService>(JwtService)
  })

  describe('signIn', () => {
    it('should throw ConflictException if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null)

      const signInDto: SignInDto = { email: 'test@example.com', password: 'password' }

      await expect(authService.signIn(signInDto)).rejects.toThrow(ConflictException)
    })

    it('should throw ConflictException if password is invalid', async () => {
      const user = { password: 'hashedPassword' }
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user)
      jest.spyOn(PasswordService, 'validatePassword').mockResolvedValue(false)

      const signInDto: SignInDto = { email: 'test@example.com', password: 'password' }

      await expect(authService.signIn(signInDto)).rejects.toThrow(ConflictException)
    })

    it('should return tokens if credentials are valid', async () => {
      const user = { id: 'userId', password: 'hashedPassword' }
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user)
      jest.spyOn(PasswordService, 'validatePassword').mockResolvedValue(true)
      jest.spyOn(authService as any, 'createTokens').mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expirationDate: new Date(),
      })

      const signInDto: SignInDto = { email: 'test@example.com', password: 'password' }

      const result = await authService.signIn(signInDto)

      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        expiration_date: expect.any(Date),
      })
    })
  })

  describe('signUp', () => {
    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue({})

      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
      }

      await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException)
    })

    it('should create a new user and return tokens if email does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null)
      jest.spyOn(userModel, 'create').mockResolvedValue({ id: 'userId' } as any)
      jest.spyOn(authService as any, 'createTokens').mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expirationDate: new Date(),
      })

      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
      }

      const result = await authService.signUp(signUpDto)

      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        expiration_date: expect.any(Date),
      })
    })
  })

  describe('refreshToken', () => {
    it('should throw ConflictException if token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error()
      })

      const refreshTokenDto: RefreshTokenDto = { token: 'token' }

      await expect(authService.refreshToken(refreshTokenDto)).rejects.toThrow(ConflictException)
    })

    it('should throw ConflictException if user is not found', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 'userId' })
      const refreshTokenDto: RefreshTokenDto = { token: 'token' }
      userModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      })

      await expect(authService.refreshToken(refreshTokenDto)).rejects.toThrow(ConflictException)
    })

    it('should return tokens if token is valid', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 'userId' })
      const accessToken = 'accessToken'
      const refreshToken = 'refreshToken'
      const refreshTokenDto: RefreshTokenDto = { token: refreshToken }
      const user = {
        _id: 'userId',
        refresh_tokens: [{ token: refreshToken }],
      }

      const findByIdMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        }),
      })
      userModel.findById = findByIdMock

      jest.spyOn(authService as any, 'calculateExpirationDate').mockReturnValue(new Date())

      jest.spyOn(authService as any, 'createAccessToken').mockResolvedValue(accessToken)

      const result = await authService.refreshToken(refreshTokenDto)

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiration_date: expect.any(Date),
      })
    })
  })

  describe('signOut', () => {
    it('should throw ConflictException if userId is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 'userId' })

      const user = { id: 'anotherUserId' }

      await expect(authService.signOut({ refresh_token: 'token' }, user as any)).rejects.toThrow(ConflictException)
    })

    it('should remove refresh token from user', async () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 'userId' })

      const user = { id: 'userId' }

      const updateOneMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      })
      userModel.updateOne = updateOneMock

      await authService.signOut({ refresh_token: 'token' }, user as any)

      expect(updateOneMock).toHaveBeenCalledWith({ _id: 'userId' }, { $pull: { refresh_tokens: { token: 'token' } } })
    })
  })

  describe('forgotPassword', () => {
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null)

      const forgotPasswordDto: ForgotPasswordDto = { email: 'email' }

      await expect(authService.forgotPassword(forgotPasswordDto)).rejects.toThrow(NotFoundException)
    })

    it('should return a new password reset token', async () => {
      const mockSave = jest.fn()
      jest.spyOn(userModel, 'findOne').mockResolvedValue({ _id: 'userId', save: mockSave } as any)

      const forgotPasswordDto: ForgotPasswordDto = { email: 'email' }

      const result = await authService.forgotPassword(forgotPasswordDto)

      expect(mockSave).toHaveBeenCalled()
      expect(result).toEqual(AuthMessages.RESET_TOKEN_SENT)
    })
  })

  describe('resetPassword', () => {
    it('should throw NotFoundException if token is invalid', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null)

      const resetPasswordDto: ResetPasswordDto = { token: 'token', password: 'password' }

      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException)
    })

    it('should reset password if token is valid', async () => {
      const mockSave = jest.fn()
      const user = { _id: 'userId', reset_token: 'token', reset_token_expiration: new Date(), password: 'password', save: mockSave }
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user)
      jest.spyOn(PasswordService, 'hashPassword').mockResolvedValue('hashedPassword')

      const resetPasswordDto: ResetPasswordDto = { token: 'token', password: 'password' }

      await authService.resetPassword(resetPasswordDto)

      expect(user.reset_token).toBeNull()
      expect(user.reset_token_expiration).toBeNull()
      expect(user.password).toBe('hashedPassword')
      expect(mockSave).toHaveBeenCalled()
    })
  })

  describe('createTokens', () => {
    it('should return access and refresh tokens with expiration date', async () => {
      const userId = 'userId'
      const accessToken = 'accessToken'
      const refreshToken = 'refreshToken'

      jest.spyOn(jwtService, 'sign').mockImplementation((payload, options) => {
        if (options?.secret === 'refreshSecret') {
          return refreshToken
        }
        return accessToken
      })
      jest.spyOn(authService as any, 'calculateExpirationDate').mockReturnValue(new Date())

      const result = await (authService as any).createTokens(userId)

      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: 'userId' },
        { $push: { refresh_tokens: { token: refreshToken, expiration_date: expect.any(Date) } } },
      )
      expect(result).toEqual({
        accessToken,
        refreshToken,
        expirationDate: expect.any(Date),
      })
    })
  })
})
