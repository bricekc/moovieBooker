import { apiRequest } from "./api";
import { MovieDetail, MoviesResponse } from "../types";

export const movieService = {
  getMovies: async (
    page: number = 1,
    search: string = "",
    sort: "popularity" | "top_rated" = "popularity"
  ): Promise<MoviesResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());

    if (search) {
      queryParams.append("search", search);
    }

    if (sort && !search) {
      queryParams.append("sort", sort);
    }

    return await apiRequest<MoviesResponse>(
      `/movies?${queryParams.toString()}`
    );
  },

  getMovieById: async (id: number): Promise<MovieDetail> => {
    return await apiRequest<MovieDetail>(`/movies/${id}`);
  },
};
