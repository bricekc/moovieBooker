import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let findOneBySpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockUserRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    findOneBySpy = jest.spyOn(userRepository, 'findOneBy');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user information when user exists', async () => {
      const user = { sub: 1, email: 'test@example.com' };
      const userEntity = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'hashedPassword',
      };
      findOneBySpy.mockResolvedValue(userEntity);

      const result = await service.getMe(user);

      expect(result).toEqual({
        email: userEntity.email,
        firstName: userEntity.firstName,
        lastName: userEntity.lastName,
      });
      expect(findOneBySpy).toHaveBeenCalledWith({ id: user.sub });
    });

    it('should throw BadRequestException when user does not exist', async () => {
      const user = { sub: 999, email: 'nonexistent@example.com' };
      findOneBySpy.mockResolvedValue(null);

      await expect(service.getMe(user)).rejects.toThrow(BadRequestException);
      expect(findOneBySpy).toHaveBeenCalledWith({ id: user.sub });
    });
  });
});
