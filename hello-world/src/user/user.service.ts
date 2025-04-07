import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async getMe(user: { sub: number; email: string }): Promise<{
    email: string;
    firstName: string;
    lastName: string;
  }> {
    const { sub } = user;
    const userEntity: User | null = await this.UserRepository.findOneBy({
      id: sub,
    });
    if (!userEntity) {
      throw new BadRequestException('User not found');
    }
    return {
      email: userEntity.email,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
    };
  }
}
