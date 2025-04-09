
import { useState, useEffect } from "react";
import { ChevronRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types";
import { getImageUrl } from "@/services/api";
import { movieService } from "@/services/movieService";
import MovieCard from "@/components/MovieCard";

const HomePage = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Charger les films populaires pour la page d'accueil
    const fetchMovies = async () => {
      try {
        // Dans un environnement réel, nous appellerions l'API
        const response = await movieService.getMovies(1, "", "popularity");
        
        // Pour la démo, utilisons les données simulées
        //const response = movieService.getMovies();
        
        if (response.length > 0) {
          // Utiliser le premier film comme film en vedette
          setFeaturedMovie(response[0]);
          
          // Utiliser les autres films pour le carrousel
          setPopularMovies(response.slice(1, 7));
        }
      } catch (error) {
        console.error("Error loading homepage movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section avec le film en vedette */}
      {featuredMovie && (
        <div className="relative w-full">
          <div className="relative h-[70vh] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${getImageUrl(featuredMovie.backdrop_path, "backdrop")})`,
                filter: "blur(1px)"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30"></div>
            
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="max-w-xl animate-fade-in">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {featuredMovie.title}
                </h1>
                <p className="text-white/90 mb-8 text-sm md:text-base line-clamp-3 md:line-clamp-4">
                  {featuredMovie.overview}
                </p>
                <div className="flex gap-4">
                  <Link to={`/movies/${featuredMovie.id}`}>
                    <Button size="lg" className="gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Voir les détails
                    </Button>
                  </Link>
                  <Link to="/movies">
                    <Button variant="outline" size="lg">
                      Tous les films
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Films Populaires */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-2xl font-bold">Films populaires</h2>
          <Link to="/movies" className="text-primary flex items-center gap-1 text-sm">
            Voir tous <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
      {/* Section d'Appel à l'Action */}
      <section className="container mx-auto px-4">
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à réserver votre prochaine séance ?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Créez votre compte gratuitement pour réserver vos places de cinéma en quelques clics
          </p>
          <Link to="/register">
            <Button size="lg">S'inscrire maintenant</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
