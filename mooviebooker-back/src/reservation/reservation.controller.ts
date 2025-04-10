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
  ApiResponse,
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
  @ApiResponse({
    status: 200,
    description: 'List of user reservations successfully retrieved',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
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
  @ApiResponse({
    status: 200,
    description: 'Reservation details successfully retrieved',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - You do not have permission to access this reservation',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found or does not belong to the user',
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
  @ApiResponse({
    status: 201,
    description: 'Reservation successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid reservation data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
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
  @ApiResponse({
    status: 200,
    description: 'Reservation successfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - You do not have permission to access this reservation',
  })
  @ApiResponse({
    status: 404,
    description: 'Reservation not found or does not belong to the user',
  })
  @Delete('/:id')
  async deleteReservation(
    @Param() params: { id: number },
    @Request() req: { user: { sub: number; email: string } },
  ) {
    return await this.reservationService.deleteReservation(
      req.user.sub,
      params.id,
    );
  }
}
