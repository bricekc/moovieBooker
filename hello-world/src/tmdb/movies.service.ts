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
  poster_path: string;
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
  poster_path: string;
  release_date: string;
  vote_average: number;
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

  getMovies(page: number, search?: string, sort?: string) {
    if (sort) {
      if (sort === 'popular') {
        this.baseUrl = 'https://api.themoviedb.org/3/movie/popular';
      } else if (sort === 'top_rated') {
        this.baseUrl = 'https://api.themoviedb.org/3/movie/top_rated';
      }
    } else {
      this.baseUrl = search
        ? `https://api.themoviedb.org/3/search/movie`
        : `https://api.themoviedb.org/3/movie/now_playing`;
    }
    return this.httpService
      .get(this.baseUrl, {
        headers: {
          Authorization: 'Bearer ' + this.apiKey,
        },
        params: {
          page,
          query: search,
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
