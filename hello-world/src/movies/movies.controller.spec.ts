import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { BadRequestException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  let getMoviesSpy: jest.SpyInstance;
  let getMovieByIdSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn(),
            getMovieById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);

    getMoviesSpy = jest.spyOn(moviesService, 'getMovies');
    getMovieByIdSpy = jest.spyOn(moviesService, 'getMovieById');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should get movies with default parameters', async () => {
      const mockMovies = [
        {
          id: 1,
          original_title: 'Test Movie',
          poster_path: '/path.jpg',
          release_date: '2023-01-01',
          title: 'Test Movie',
          overview: 'A test movie',
        },
      ];
      getMoviesSpy.mockResolvedValue(mockMovies);

      const result = controller.getMovies(1, undefined, undefined);
      const actualValue = await result;
      expect(actualValue).toEqual(mockMovies);
      expect(getMoviesSpy).toHaveBeenCalledWith(1, undefined, undefined);
    });

    it('should get movies with search parameter', async () => {
      const mockMovies = [
        {
          id: 2,
          original_title: 'Search Result',
          poster_path: '/search.jpg',
          release_date: '2023-02-02',
          title: 'Search Result',
          overview: 'A search result',
        },
      ];
      getMoviesSpy.mockResolvedValue(mockMovies);

      const result = controller.getMovies(1, 'test query', undefined);
      const actualValue = await result;
      expect(actualValue).toEqual(mockMovies);
      expect(getMoviesSpy).toHaveBeenCalledWith(1, 'test query', undefined);
    });

    it('should get movies with sort parameter', async () => {
      const mockMovies = [
        {
          id: 3,
          original_title: 'Popular Movie',
          poster_path: '/popular.jpg',
          release_date: '2023-03-03',
          title: 'Popular Movie',
          overview: 'A popular movie',
        },
      ];
      getMoviesSpy.mockResolvedValue(mockMovies);

      const sortOption = 'popular' as any;
      const result = controller.getMovies(1, undefined, sortOption);
      const actualValue = await result;
      expect(actualValue).toEqual(mockMovies);
      expect(getMoviesSpy).toHaveBeenCalledWith(1, undefined, sortOption);
    });

    it('should throw BadRequestException when both search and sort are provided', () => {
      const sortOption = 'popular' as any;

      expect(() => controller.getMovies(1, 'test', sortOption)).toThrow(
        BadRequestException,
      );
      expect(() => controller.getMovies(1, 'test', sortOption)).toThrow(
        'You can only use "search" OR "sort" parameter.',
      );
      expect(getMoviesSpy).not.toHaveBeenCalled();
    });
  });

  describe('getMovieById', () => {
    it('should get movie details by id', async () => {
      const mockMovie = {
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
      };
      getMovieByIdSpy.mockResolvedValue(mockMovie);

      const result = controller.getMovieById({ id: 5 });
      const actualValue = await result;
      expect(actualValue).toEqual(mockMovie);
      expect(getMovieByIdSpy).toHaveBeenCalledWith(5);
    });
  });
});
