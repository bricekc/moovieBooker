import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { CreateReservationDto } from './dto/CreateReservationDto';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get reservations',
  })
  @Get('/')
  async getAllByUser(@Request() req: { user: { sub: number; email: string } }) {
    return await this.reservationService.getAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the reservation',
  })
  @ApiOperation({
    summary: 'Get one reservation by id',
  })
  @Get('/:id')
  async getOneByUser(
    @Param() params: { id: number },
    @Request() req: { user: { sub: number; email: string } },
  ) {
    return await this.reservationService.getOneByUser(req.user.sub, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: CreateReservationDto,
    description: 'The reservation to create',
  })
  @ApiOperation({
    summary: 'Create a reservation',
  })
  @Post('/')
  async createReservation(
    @Body() createResevationDto: CreateReservationDto,
    @Request() req: { user: { sub: number; email: string } },
  ) {
    return await this.reservationService.createReserversation(
      req.user.sub,
      createResevationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete one reservation',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the reservation',
  })
  @Delete('/:id')
  async deleteReservation(
    @Param() params: { id: number },
    @Request() req: { user: { sub: number; email: string } },
  ) {
    console.log('params', params);
    return await this.reservationService.deleteReservation(
      req.user.sub,
      params.id,
    );
  }
}
