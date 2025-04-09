import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('register')
  register(@Body() registerUser: RegisterDto): Promise<string> {
    return this.authService.register(registerUser);
  }

  @ApiOperation({
    summary: 'Login a user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
