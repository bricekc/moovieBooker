import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

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
    required: true,
    description: ' The page number of the movies',
    default: 1,
  })
  getMovies(@Query('page') page: number) {
    return this.movieService.getMovies(page);
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
