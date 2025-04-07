import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from './dto/RegisterDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerUser: RegisterDto): Promise<string> {
    return this.authService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const token = await this.authService.login(loginDto);
    res.status(200).json({ token });
  }
}
