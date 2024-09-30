import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { TripsService } from './trips.service'
import { TripProviderFactory } from './trip-provider.factory'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PaginateModel } from 'mongoose'
import { SearchTripDto } from './dto/SearchTrip.dto'
import { Trip } from './schemas/trip.schema'
import { PROVIDER } from './types/provider'
import { SaveTripDto } from './dto/SaveTrip.dto'
import { User } from '@core/users/schemas/user.schema'
import { PaginateDto } from '@common/dto/paginate.dto'

describe('TripsService', () => {
  let service: TripsService
  let tripModel: PaginateModel<Trip>
  let tripProviderFactory: TripProviderFactory

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        {
          provide: getModelToken(Trip.name),
          useValue: {
            create: jest.fn(),
            paginate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        {
          provide: TripProviderFactory,
          useValue: {
            getProvider: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<TripsService>(TripsService)
    tripModel = module.get<PaginateModel<Trip>>(getModelToken(Trip.name))
    tripProviderFactory = module.get<TripProviderFactory>(TripProviderFactory)
  })

  describe('search', () => {
    it('should return mapped trips', async () => {
      const query: SearchTripDto = {
        origin: 'ORI',
        destination: 'DES',
      }
      const mockTrips = [{ id: '1', provider: PROVIDER.bizaway }]
      const provider = { searchTrips: jest.fn().mockResolvedValue(mockTrips) }
      jest.spyOn(tripProviderFactory, 'getProvider').mockReturnValue(provider as any)

      const result = await service.search(query)

      expect(result).toEqual(mockTrips)
      expect(provider.searchTrips).toHaveBeenCalledWith(query)
    })

    it('should throw BadRequestException on error', async () => {
      const query: SearchTripDto = {
        origin: 'ORI',
        destination: 'DES',
      }
      const provider = { searchTrips: jest.fn().mockRejectedValue(new Error()) }
      jest.spyOn(tripProviderFactory, 'getProvider').mockReturnValue(provider as any)

      await expect(service.search(query)).rejects.toThrow(BadRequestException)
    })
  })

  describe('save', () => {
    it('should save and return trip', async () => {
      const body: SaveTripDto = { id: '1', provider: PROVIDER.bizaway }
      const user = { _id: 'user1' }
      const provider = { getTrip: jest.fn().mockResolvedValue({ id: '1' }) }
      jest.spyOn(tripProviderFactory, 'getProvider').mockReturnValue(provider as any)
      jest.spyOn(tripModel, 'create').mockResolvedValue({ id: '1', user: 'user1' } as any)

      const result = await service.save(body, user as User)

      expect(result).toEqual({ id: '1', user: 'user1' })
      expect(provider.getTrip).toHaveBeenCalledWith(body.id)
      expect(tripModel.create).toHaveBeenCalledWith({
        id: '1',
        external_id: '1',
        user: 'user1',
        provider: PROVIDER.bizaway,
      })
    })

    it('should throw NotFoundException on error', async () => {
      const body: SaveTripDto = { id: '1', provider: PROVIDER.bizaway }
      const user = { _id: 'user1' } as User
      const provider = { getTrip: jest.fn().mockRejectedValue(new Error()) }
      jest.spyOn(tripProviderFactory, 'getProvider').mockReturnValue(provider as any)

      await expect(service.save(body, user)).rejects.toThrow(NotFoundException)
    })
  })

  describe('getUserTrips', () => {
    it('should return paginated trips', async () => {
      const query: PaginateDto = { page: 1, limit: 10 }
      const user = { _id: 'user1' } as User
      const paginateResult = { docs: [], total: 0, limit: 10, page: 1, pages: 1, hasNextPage: false }
      jest.spyOn(tripModel, 'paginate').mockResolvedValue(paginateResult as any)

      const result = await service.getUserTrips(query, user)

      expect(result).toEqual(paginateResult)
      expect(tripModel.paginate).toHaveBeenCalledWith({ user: 'user1' }, { page: 1, limit: 10 })
    })
  })

  describe('deleteTrip', () => {
    it('should delete trip', async () => {
      const id = '1'
      const user = { _id: 'user1' } as User
      jest.spyOn(tripModel, 'findOneAndDelete').mockResolvedValue({ id: '1' })

      await service.deleteTrip(id, user)

      expect(tripModel.findOneAndDelete).toHaveBeenCalledWith({ _id: id, user: 'user1' })
    })

    it('should throw NotFoundException if trip not found', async () => {
      const id = '1'
      const user = { _id: 'user1' } as User
      jest.spyOn(tripModel, 'findOneAndDelete').mockResolvedValue(null)

      await expect(service.deleteTrip(id, user)).rejects.toThrow(NotFoundException)
    })
  })
})
