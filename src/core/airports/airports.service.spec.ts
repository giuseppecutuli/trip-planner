import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { AirportsService } from './airports.service'
import { Airport } from './schemas/airport.schema'
import { PaginateDto } from '@common/dto/paginate.dto'
import { PaginateModel } from 'mongoose'

describe('AirportsService', () => {
  let service: AirportsService
  let model: PaginateModel<Airport>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportsService,
        {
          provide: getModelToken(Airport.name),
          useValue: {
            paginate: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AirportsService>(AirportsService)
    model = module.get<PaginateModel<Airport>>(getModelToken(Airport.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should call paginate with correct parameters', async () => {
      const query: PaginateDto = { page: 1, limit: 10 }
      const result = {
        docs: [],
        totalDocs: 0,
        limit: query.limit,
        page: query.page,
        totalPages: 0,
        pagingCounter: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
        offset: 0,
      }
      jest.spyOn(model, 'paginate').mockResolvedValue(result)

      expect(await service.findAll(query)).toEqual(result)
      expect(model.paginate).toHaveBeenCalledWith({}, { page: query.page, limit: query.limit })
    })
  })
})
