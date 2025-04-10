
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "@/services/movieService";
import { Movie } from "@/types";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { se } from "date-fns/locale";

interface MovieGridProps {
  initialMovies?: Movie[];
}

const MovieGrid = ({ initialMovies }: MovieGridProps) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "popularity";
  const sort = sortParam === "top_rated" ? "top_rated" : "popularity";

  const [movies, setMovies] = useState<Movie[]>(initialMovies || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Charger les films quand les filtres changent
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Dans un environnement réel, nous appellerions l'API
        // const response = await movieService.getMovies(1, searchQuery, sort);
        
        // Pour la démo, utilisons les données simulées
        const response = await movieService.getMovies(1, searchQuery, sort);
        setMovies(response.movies);
        setTotalPages(response.total_pages);
        setPage(1);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, sort]);

  // Charger plus de films (pagination)
  const loadMore = async () => {
    if (page >= totalPages) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      
      // Dans un environnement réel, nous appellerions l'API
      // const response = await movieService.getMovies(nextPage, searchQuery, sort);
      
      // Pour la démo, utilisons les données simulées
      const response = await movieService.getMovies(nextPage, searchQuery);
      
      setMovies((prevMovies) => [...prevMovies, ...response.movies]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Aucun film trouvé</h2>
          <p className="text-muted-foreground">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {page < totalPages && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={loadMore}
                disabled={loading}
                className="min-w-[150px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  "Voir plus de films"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieGrid;
