import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let getMeSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockUserService = {
      getMe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    getMeSpy = jest.spyOn(userService, 'getMe');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user information', async () => {
      const user = { sub: 1, email: 'test@example.com' };
      const expectedResult = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      getMeSpy.mockResolvedValue(expectedResult);

      const result = await controller.getMe({ user });

      expect(result).toEqual(expectedResult);
      expect(getMeSpy).toHaveBeenCalledWith(user);
    });
  });
});
