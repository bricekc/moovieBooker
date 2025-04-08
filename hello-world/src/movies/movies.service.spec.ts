import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;
  let configService: ConfigService;

  const API_KEY = 'test-api-key';

  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue(API_KEY),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovies', () => {
    it('should get now playing movies when no search or sort is provided', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          results: [
            {
              id: 1,
              original_title: 'Test Movie',
              poster_path: '/path.jpg',
              release_date: '2023-01-01',
              title: 'Test Movie',
              overview: 'A test movie',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const movies = await service.getMovies(1);

      expect(movies).toEqual([
        {
          id: 1,
          original_title: 'Test Movie',
          poster_path: '/path.jpg',
          release_date: '2023-01-01',
          title: 'Test Movie',
          overview: 'A test movie',
        },
      ]);
    });

    it('should get popular movies when sort is "popular"', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          results: [
            {
              id: 3,
              original_title: 'Popular Movie',
              poster_path: '/popular.jpg',
              release_date: '2023-03-03',
              title: 'Popular Movie',
              overview: 'A popular movie',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const movies = await service.getMovies(1, undefined, 'popular');

      expect(movies).toEqual([
        {
          id: 3,
          original_title: 'Popular Movie',
          poster_path: '/popular.jpg',
          release_date: '2023-03-03',
          title: 'Popular Movie',
          overview: 'A popular movie',
        },
      ]);
    });
  });

  describe('getMovieById', () => {
    it('should get movie details by id', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          id: 5,
          genres: [{ id: 1, name: 'Action' }],
          budget: 1000000,
          overview: 'A detailed movie',
          original_language: 'en',
          original_title: 'Detailed Movie',
          popularity: 8.5,
          poster_path: '/detailed.jpg',
          release_date: '2023-05-05',
          vote_average: 7.8,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const movie = await service.getMovieById(5);

      expect(movie).toEqual({
        id: 5,
        genres: [{ id: 1, name: 'Action' }],
        budget: 1000000,
        overview: 'A detailed movie',
        original_language: 'en',
        original_title: 'Detailed Movie',
        popularity: 8.5,
        poster_path: '/detailed.jpg',
        release_date: '2023-05-05',
        vote_average: 7.8,
      });
    });
  });
});
