import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { of, throwError } from 'rxjs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateReservationDto } from './dto/CreateReservationDto';
import { AxiosResponse } from 'axios';
import { DeleteResult } from 'typeorm';
import { User } from '../user/user.entity';

describe('ReservationService', () => {
  let service: ReservationService;
  let reservationRepository: Repository<Reservation>;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password',
    reservations: [],
  } as User;

  const mockReservation: Reservation = {
    id: 1,
    movieId: 123,
    reservationDate: new Date('2023-05-20T14:00:00Z'),
    user: mockUser,
  } as Reservation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            findBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() =>
              of({
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
              } as AxiosResponse),
            ),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    reservationRepository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    );
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all reservations for a user', async () => {
      const userId = 1;
      const mockReservations: Reservation[] = [mockReservation];

      jest
        .spyOn(reservationRepository, 'findBy')
        .mockResolvedValue(mockReservations);

      const result = await service.getAll(userId);

      expect(reservationRepository.findBy).toHaveBeenCalledWith({
        user: { id: userId },
      });
      expect(result).toEqual(mockReservations);
    });
  });

  describe('getOneByUser', () => {
    it('should return a reservation if it belongs to the user', async () => {
      const userId = 1;
      const reservationId = 1;

      jest
        .spyOn(reservationRepository, 'findOne')
        .mockResolvedValue(mockReservation);

      const result = await service.getOneByUser(userId, reservationId);

      expect(reservationRepository.findOne).toHaveBeenCalledWith({
        where: { id: reservationId },
        relations: { user: true },
      });
      expect(result).toEqual({
        id: mockReservation.id,
        movieId: mockReservation.movieId,
        reservationDate: mockReservation.reservationDate,
      });
    });

    it('should throw BadRequestException if reservation does not exist', async () => {
      const userId = 1;
      const reservationId = 999;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getOneByUser(userId, reservationId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException if reservation does not belong to user', async () => {
      const userId = 2;
      const reservationId = 1;

      jest
        .spyOn(reservationRepository, 'findOne')
        .mockResolvedValue(mockReservation);

      await expect(service.getOneByUser(userId, reservationId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('createReserversation', () => {
    const createDto: CreateReservationDto = {
      movieId: 123,
      reservationDate: new Date('2023-05-20T14:00:00Z'),
    };

    it('should create a reservation successfully', async () => {
      const userId = 1;
      const savedReservation = mockReservation;

      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: { title: 'Test Movie' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse),
      );

      jest.spyOn(reservationRepository, 'findBy').mockResolvedValue([]);
      jest
        .spyOn(reservationRepository, 'save')
        .mockResolvedValue(savedReservation);

      const result = await service.createReserversation(userId, createDto);

      expect(httpService.get).toHaveBeenCalled();
      expect(reservationRepository.findBy).toHaveBeenCalledWith({
        user: { id: userId },
      });
      expect(reservationRepository.save).toHaveBeenCalledWith({
        ...createDto,
        user: { id: userId },
      });
      expect(result).toEqual(savedReservation);
    });

    it('should throw BadRequestException if movie is not found', async () => {
      const userId = 1;
      const error = { status: 404, response: {} };

      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      await expect(
        service.createReserversation(userId, createDto),
      ).rejects.toThrow(BadRequestException);
      expect(httpService.get).toHaveBeenCalled();
    });

    it('should throw BadRequestException if reservation is within 2 hours of another', async () => {
      const userId = 1;
      const existingReservation: Reservation = {
        ...mockReservation,
        reservationDate: new Date('2023-05-20T15:30:00Z'),
      };

      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: { title: 'Test Movie' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse),
      );

      jest
        .spyOn(reservationRepository, 'findBy')
        .mockResolvedValue([existingReservation]);

      await expect(
        service.createReserversation(userId, createDto),
      ).rejects.toThrow(BadRequestException);
      expect(httpService.get).toHaveBeenCalled();
      expect(reservationRepository.findBy).toHaveBeenCalledWith({
        user: { id: userId },
      });
    });
  });

  describe('deleteReservation', () => {
    it('should delete a reservation if it belongs to the user', async () => {
      const userId = 1;
      const reservationId = 1;
      const deleteResult: DeleteResult = {
        raw: {},
        affected: 1,
      };

      jest
        .spyOn(reservationRepository, 'findOne')
        .mockResolvedValue(mockReservation);
      jest
        .spyOn(reservationRepository, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await service.deleteReservation(userId, reservationId);

      expect(reservationRepository.findOne).toHaveBeenCalledWith({
        where: { id: reservationId },
        relations: { user: true },
      });
      expect(reservationRepository.delete).toHaveBeenCalledWith(reservationId);
      expect(result).toEqual(deleteResult);
    });

    it('should throw BadRequestException if reservation does not exist', async () => {
      const userId = 1;
      const reservationId = 999;

      jest.spyOn(reservationRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.deleteReservation(userId, reservationId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if reservation does not belong to user', async () => {
      const userId = 2;
      const reservationId = 1;

      jest
        .spyOn(reservationRepository, 'findOne')
        .mockResolvedValue(mockReservation);

      await expect(
        service.deleteReservation(userId, reservationId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
