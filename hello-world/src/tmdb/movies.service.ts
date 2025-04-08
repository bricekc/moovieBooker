import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';

interface TMDBResponse {
  data: {
    results: TMDBMovie[];
  };
}

interface TMDBMovie {
  id: number;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  title: string;
  overview: string;
}

interface TMDBDetailResponse {
  data: TMDBMovieDetails;
}

interface TMDBMovieDetails {
  id: number;
  genres: Array<{ id: number; name: string }>;
  budget: number;
  overview: string;
  original_language: string;
  original_title: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

@Injectable()
export class MoviesService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY') as string;
  }

  getMovies(page: number) {
    return this.httpService
      .get(`${this.baseUrl}/movie/now_playing`, {
        headers: {
          Authorization: 'Bearer ' + this.apiKey,
        },
        params: {
          page,
        },
      })
      .pipe(
        map((response: TMDBResponse) => {
          return response.data.results.map((movie: TMDBMovie) => {
            return {
              id: movie.id,
              release_date: movie.release_date,
              poster_path: movie.poster_path,
              original_title: movie.original_title,
              title: movie.title,
              overview: movie.overview,
            };
          });
        }),
      );
  }

  getMovieById(id: number) {
    return this.httpService
      .get(`${this.baseUrl}/movie/${id}`, {
        headers: {
          Authorization: 'Bearer ' + this.apiKey,
        },
      })
      .pipe(
        map((reponse: TMDBDetailResponse) => {
          return {
            id: reponse.data.id,
            genres: reponse.data.genres,
            budget: reponse.data.budget,
            overview: reponse.data.overview,
            original_language: reponse.data.original_language,
            original_title: reponse.data.original_title,
            popularity: reponse.data.popularity,
            poster_path: reponse.data.poster_path,
            release_date: reponse.data.release_date,
            vote_average: reponse.data.vote_average,
          };
        }),
      );
  }
}
