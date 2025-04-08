import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let jwtService: JwtService;

  // Mock data
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockRegisterDto: RegisterDto = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    // Mock bcrypt
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashedPassword'));
    jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash) => {
      return Promise.resolve(
        password === 'password123' && hash === 'hashedPassword',
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.register(mockRegisterDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockRegisterDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.password, 10);
      expect(userRepository.save).toHaveBeenCalledWith({
        email: mockRegisterDto.email,
        password: 'hashedPassword',
        firstName: mockRegisterDto.firstName,
        lastName: mockRegisterDto.lastName,
      });
      expect(result).toEqual(mockRegisterDto.email);
    });

    it('should throw BadRequestException if user already exists', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockRegisterDto.email,
      });
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login a user successfully and return a JWT token', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);
      // No need to mock jwtService.signAsync here as it's already mocked in the beforeEach

      const result = await service.login(mockLoginDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockLoginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual('jwt-token');
    });

    it('should throw BadRequestException if user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockLoginDto.email,
      });
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser);

      // Create a new mock implementation just for this test
      const originalCompare = bcrypt.compare;
      const mockCompare = jest.fn().mockResolvedValue(false);
      jest.spyOn(bcrypt, 'compare').mockImplementation(mockCompare);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: mockLoginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();

      // Restore the original mock implementation
      jest.spyOn(bcrypt, 'compare').mockImplementation(originalCompare);
    });
  });
});
