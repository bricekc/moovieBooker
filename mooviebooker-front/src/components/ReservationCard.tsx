import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Trash2, Film, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Reservation, MovieDetail } from "@/types";
import { getImageUrl } from "@/services/api";
import { reservationService } from "@/services/reservationService";
import { movieService } from "@/services/movieService";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ReservationCardProps {
  reservation: Reservation;
  onCancelled: () => void;
}

const ReservationCard = ({ reservation, onCancelled }: ReservationCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetail | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Si nous avons déjà toutes les infos du film nécessaires, on ne fait pas de requête
        if (reservation.movie?.poster_path && reservation.movie?.title) {
          setMovieDetails(reservation.movie as unknown as MovieDetail);
          setLoadingMovie(false);
          return;
        }

        // Récupérer les détails du film par son ID
        const movieData = await movieService.getMovieById(reservation.movieId);
        setMovieDetails(movieData);
      } catch (error) {
        console.error("Error loading movie details:", error);
      } finally {
        setLoadingMovie(false);
      }
    };

    fetchMovieDetails();
  }, [reservation.movieId, reservation.movie]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Utiliser l'API réelle 
      await reservationService.deleteReservation(reservation.id);
      
      toast.success("Réservation annulée avec succès");
      onCancelled();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Erreur lors de l'annulation de la réservation");
    } finally {
      setIsDeleting(false);
    }
  };

  const movieTitle = movieDetails?.title || reservation.movie?.title || "Film";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Image du film */}
        <Link 
          to={`/movies/${reservation.movieId}`} 
          className="md:w-1/3 h-40 md:h-auto overflow-hidden bg-muted"
        >
          {loadingMovie ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : movieDetails?.poster_path ? (
            <img
              src={getImageUrl(movieDetails.poster_path)}
              alt={movieTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>

        {/* Détails de la réservation */}
        <div className="flex-1 flex flex-col">
          <CardContent className="p-4">
            <Link 
              to={`/movies/${reservation.movieId}`}
              className="font-bold text-lg mb-2 hover:text-primary transition-colors"
            >
              {loadingMovie ? <Skeleton className="h-6 w-48" /> : movieTitle}
            </Link>
            
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(reservation.reservationDate)}
              <Clock className="h-4 w-4 ml-4 mr-2" />
              {formatTime(reservation.reservationDate)}
            </div>

            <p className="text-sm text-muted-foreground">
              Réservation effectuée le {formatDate(reservation.createdAt)}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0 mt-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting} className="w-full sm:w-auto">
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Annuler la réservation
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir annuler votre réservation pour "{movieTitle}" ? 
                    Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Confirmer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;