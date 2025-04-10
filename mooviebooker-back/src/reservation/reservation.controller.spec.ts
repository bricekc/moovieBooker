import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/CreateReservationDto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockUser = { sub: 1, email: 'test@example.com' };
  const mockReservation = {
    id: 1,
    movieId: 123,
    reservationDate: new Date(),
    user: { id: 1 },
  };

  const mockService = {
    getAll: jest.fn(),
    getOneByUser: jest.fn(),
    createReserversation: jest.fn(),
    deleteReservation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllByUser', () => {
    it('should return all reservations for a user', async () => {
      mockService.getAll.mockResolvedValue([mockReservation]);

      const result = await controller.getAllByUser({ user: mockUser });

      expect(result).toEqual([mockReservation]);
      expect(service.getAll).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('getOneByUser', () => {
    it('should return one reservation for the user', async () => {
      mockService.getOneByUser.mockResolvedValue(mockReservation);

      const result = await controller.getOneByUser(
        { id: 1 },
        { user: mockUser },
      );

      expect(result).toEqual(mockReservation);
      expect(service.getOneByUser).toHaveBeenCalledWith(mockUser.sub, 1);
    });
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      const dto: CreateReservationDto = {
        movieId: 123,
        reservationDate: new Date(),
      };

      mockService.createReserversation.mockResolvedValue(mockReservation);

      const result = await controller.createReservation(dto, {
        user: mockUser,
      });

      expect(result).toEqual(mockReservation);
      expect(service.createReserversation).toHaveBeenCalledWith(
        mockUser.sub,
        dto,
      );
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation', async () => {
      const deleteResult = { affected: 1 };
      mockService.deleteReservation.mockResolvedValue(deleteResult);

      const result = await controller.deleteReservation(
        { id: 1 },
        { user: mockUser },
      );

      expect(result).toEqual(deleteResult);
      expect(service.deleteReservation).toHaveBeenCalledWith(mockUser.sub, 1);
    });
  });
});
