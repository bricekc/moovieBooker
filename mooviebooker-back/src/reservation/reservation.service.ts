import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/CreateReservationDto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReservationService {
  private readonly apiKey: string;

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') as string;
  }

  async getAll(userId: number) {
    const reservations = await this.reservationRepository.findBy({
      user: {
        id: userId,
      },
    });
    return reservations;
  }

  async getOneByUser(userId: number, reservationId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      //https://orkhan.gitbook.io/typeorm/docs/find-options
      relations: {
        user: true,
      },
    });
    if (!reservation) {
      throw new BadRequestException('The reservation does not exist');
    }
    if (reservation.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this reservation',
      );
    }
    return reservation;
  }

  async createReserversation(
    userId: number,
    reservation: CreateReservationDto,
  ) {
    try {
      await firstValueFrom(
        this.httpService.get(
          `https://api.themoviedb.org/3/movie/${reservation.movieId}`,
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
          },
        ),
      );
    } catch (error) {
      if (error.status === 404) {
        throw new BadRequestException('Movie not found.');
      }
      throw new BadRequestException('Failed to fetch movie details.');
    }

    const userReservations = await this.reservationRepository.findBy({
      user: {
        id: userId,
      },
    });
    const reservationDate = new Date(reservation.reservationDate);

    for (const existing of userReservations) {
      const existingDate = new Date(existing.reservationDate);
      //https://www.w3schools.com/jsref/jsref_gettime.asp
      const diff = Math.abs(reservationDate.getTime() - existingDate.getTime());

      if (diff / (1000 * 60 * 60) < 2) {
        throw new BadRequestException(
          'You cannot reserve a movie within 2 hours of another reservation.',
        );
      }
    }
    return await this.reservationRepository.save({
      ...reservation,
      user: { id: userId },
    });
  }

  async deleteReservation(userId: number, reservationId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: {
        user: true,
      },
    });

    if (!reservation) {
      throw new BadRequestException('The reservation does not exist');
    }

    if (reservation.user.id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this reservation',
      );
    }

    return await this.reservationRepository.delete(reservationId);
  }
}
