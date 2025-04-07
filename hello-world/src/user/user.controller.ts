import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @Request() req: { user: { sub: number; email: string } },
  ): Promise<{
    email: string;
    firstName: string;
    lastName: string;
  }> {
    return this.userService.getMe(req.user);
  }
}
