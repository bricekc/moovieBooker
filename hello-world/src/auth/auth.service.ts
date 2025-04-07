import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/LoginDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    //https://docs.nestjs.com/recipes/mikroorm#repositories
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    //https://docs.nestjs.com/security/authentication#jwt-token
    private jwtService: JwtService,
  ) {}

  async register(registerUser: RegisterDto): Promise<string> {
    const { email, password, firstName, lastName } = registerUser;
    const user: User | null = await this.UserRepository.findOneBy({ email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    //https://docs.nestjs.com/security/encryption-and-hashing#hashing
    const hash: string = await bcrypt.hash(password, 10);
    await this.UserRepository.save({
      email,
      password: hash,
      firstName,
      lastName,
    });
    return email;
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user: User | null = await this.UserRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    //https://docs.nestjs.com/security/encryption-and-hashing#hashing
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
