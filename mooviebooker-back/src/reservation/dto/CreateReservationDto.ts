import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'The ID of the user making the reservation',
    default: 950387,
  })
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({
    description: 'The ID of the movie being reserved',
    default: new Date().toISOString(),
  })
  @IsNotEmpty()
  reservationDate: Date;
}
