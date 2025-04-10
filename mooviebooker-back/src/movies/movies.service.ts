import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
}

interface TMDBMovie {
  id: number;
  original_title: string;
  poster_path: string;
  release_date: string;
  title: string;
  overview: string;
  backdrop_path: string;
}

interface TMDBMovieDetails {
  id: number;
  genres: Array<{ id: number; name: string }>;
  budget: number;
  overview: string;
  original_language: string;
  original_title: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string;
  runtime: number;
}

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private baseUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') as string;
  }

  async getMovies(page: number, search?: string, sort?: string) {
    if (sort) {
      if (sort === 'popularity') {
        this.baseUrl = 'https://api.themoviedb.org/3/movie/popular';
      } else if (sort === 'top_rated') {
        this.baseUrl = 'https://api.themoviedb.org/3/movie/top_rated';
      }
    } else {
      this.baseUrl = search
        ? `https://api.themoviedb.org/3/search/movie`
        : `https://api.themoviedb.org/3/movie/now_playing`;
    }

    try {
      //https://docs.nestjs.com/techniques/http-module#full-example
      const response = await firstValueFrom<AxiosResponse<TMDBResponse>>(
        this.httpService.get(this.baseUrl, {
          headers: {
            Authorization: 'Bearer ' + this.apiKey,
          },
          params: {
            page,
            query: search,
          },
        }),
      );

      return {
        movies: response.data.results.map((movie: TMDBMovie) => ({
          id: movie.id,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          original_title: movie.original_title,
          title: movie.title,
          overview: movie.overview,
          backdrop_path: movie.backdrop_path,
        })),
        total_pages: response.data.total_pages,
      };
    } catch {
      throw new BadRequestException(`Failed to fetch movies`);
    }
  }

  async getMovieById(id: number) {
    try {
      const response = await firstValueFrom<AxiosResponse<TMDBMovieDetails>>(
        this.httpService.get(`https://api.themoviedb.org/3/movie/${id}`, {
          headers: {
            Authorization: 'Bearer ' + this.apiKey,
          },
        }),
      );

      return {
        id: response.data.id,
        genres: response.data.genres,
        budget: response.data.budget,
        overview: response.data.overview,
        original_language: response.data.original_language,
        original_title: response.data.original_title,
        popularity: response.data.popularity,
        poster_path: response.data.poster_path,
        release_date: response.data.release_date,
        vote_average: response.data.vote_average,
        backdrop_path: response.data.backdrop_path,
        runtime: response.data.runtime,
      };
    } catch (error) {
      if (error.status === 404) {
        throw new BadRequestException(`Movie not found`);
      }
      throw new BadRequestException(`Failed to fetch movies`);
    }
  }
}
