import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { BizawayProvider } from './bizaway.provider'
import { SORT_BY } from '@core/trips/types/sortBy'
import { ExternalTrip } from '@core/trips/models/trip.model'

describe('BizawayProvider', () => {
  let bizawayProvider: BizawayProvider

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BizawayProvider,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              url: 'http://example.com',
              apiKey: 'test-api-key',
            }),
          },
        },
      ],
    }).compile()

    bizawayProvider = module.get<BizawayProvider>(BizawayProvider)
  })

  it('should fetch and sort trips by cost', async () => {
    const trip1: ExternalTrip = {
      id: '1',
      cost: 200,
      duration: 120,
      type: 'bus',
      origin: 'ORI',
      destination: 'DES',
      display_name: 'ORI to DES',
      provider: 'bizaway',
    }
    const trip2: ExternalTrip = {
      id: '2',
      cost: 100,
      duration: 60,
      type: 'bus',
      origin: 'ORI',
      destination: 'DES',
      display_name: 'ORI to DES',
      provider: 'bizaway',
    }

    bizawayProvider.httpService.get = jest.fn().mockResolvedValue({ data: [trip1, trip2] })

    const params = { destination: 'DES', origin: 'ORI', sort_by: SORT_BY.cheapest }
    const result = await bizawayProvider.searchTrips(params)

    expect(bizawayProvider.httpService.get).toHaveBeenCalledWith('/trips', { params })
    expect(result).toEqual([trip2, trip1])
  })

  it('should fetch and sort trips by duration', async () => {
    const trip1: ExternalTrip = {
      id: '1',
      cost: 200,
      duration: 120,
      type: 'bus',
      origin: 'ORI',
      destination: 'DES',
      display_name: 'ORI to DES',
      provider: 'bizaway',
    }
    const trip2: ExternalTrip = {
      id: '2',
      cost: 100,
      duration: 60,
      type: 'bus',
      origin: 'ORI',
      destination: 'DES',
      display_name: 'ORI to DES',
      provider: 'bizaway',
    }

    bizawayProvider.httpService.get = jest.fn().mockResolvedValue({ data: [trip1, trip2] })

    const params = { destination: 'DES', origin: 'ORI', sort_by: SORT_BY.fastest }
    const result = await bizawayProvider.searchTrips(params)

    expect(bizawayProvider.httpService.get).toHaveBeenCalledWith('/trips', { params })
    expect(result).toEqual([trip2, trip1])
  })

  it('should fetch a trip by ID', async () => {
    const trip: ExternalTrip = {
      id: '2',
      cost: 100,
      duration: 60,
      type: 'bus',
      origin: 'ORI',
      destination: 'DES',
      display_name: 'ORI to DES',
      provider: 'bizaway',
    }

    bizawayProvider.httpService.get = jest.fn().mockResolvedValue({ data: trip })

    const result = await bizawayProvider.getTrip('1')

    expect(bizawayProvider.httpService.get).toHaveBeenCalledWith('/trips/1')
    expect(result).toEqual(trip)
  })
})
