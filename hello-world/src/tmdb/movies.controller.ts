import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

enum MovieSortOption {
  POPULAR = 'popular',
  TOP_RATED = 'top_rated',
}

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}
  //https://docs.nestjs.com/controllers#query-parameters
  @ApiOperation({
    summary: 'Get movies',
  })
  @Get('/')
  @ApiQuery({
    name: 'page',
    required: false,
    description: ' The page number of the movies',
    default: 1,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'The search term to filter movies',
    default: '',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'The sort type of the movies',
    enum: MovieSortOption,
  })
  getMovies(
    @Query('page') page: number = 1,
    @Query('search') search: string,
    @Query('sort') sort: MovieSortOption,
  ) {
    if (search && sort) {
      throw new BadRequestException(
        'You can only use "search" OR "sort" parameter.',
      );
    }
    return this.movieService.getMovies(page, search, sort);
  }

  //https://docs.nestjs.com/controllers#route-parameters
  @ApiOperation({
    summary: 'Get the detail of one movie',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The id of the movie',
  })
  @Get('/:id')
  getMovieById(@Param() params: { id: number }) {
    return this.movieService.getMovieById(params.id);
  }
}
