
import { Link } from "react-router-dom";
import { Calendar, Star } from "lucide-react";
import { Movie } from "@/types";
import { getImageUrl } from "@/services/api";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  return (
    <Link to={`/movies/${movie.id}`} className={cn("block movie-card", className)}>
      <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <h3 className="font-bold text-white line-clamp-2 mb-1">{movie.title}</h3>
          
          <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(movie.release_date).toLocaleDateString("fr-FR", {
                year: "numeric",
              })}
            </span>
            <span className="flex items-center ml-auto">
              <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-0.5" />
              {movie.vote_average}
            </span>
          </div>
          
          <p className="text-xs text-white/80 line-clamp-3">{movie.overview}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
