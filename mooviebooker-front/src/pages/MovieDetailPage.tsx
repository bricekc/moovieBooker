import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { MovieDetail } from "@/types";
import { getImageUrl } from "@/services/api";
import { movieService } from "@/services/movieService";
import { reservationService } from "@/services/reservationService";
import { toast } from "sonner";

const MovieDetailPage = () => {
  const { id } = useParams();
  const movieId = Number(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Demain par défaut
  );
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [isReserving, setIsReserving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId || isNaN(movieId)) {
        navigate("/movies");
        return;
      }
      
      try {
        setLoading(true);
        
        // Use the real API call
        const movieData = await movieService.getMovieById(movieId);
        setMovie(movieData);
      } catch (error) {
        console.error("Error loading movie details:", error);
        toast.error("Erreur lors du chargement des détails du film");
        navigate("/movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, navigate]);

  // Convertir la date et l'heure sélectionnées en objet Date
  const getReservationDateTime = () => {
    if (!selectedDate) return new Date();
    
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes);
    return dateTime;
  };

  // Gérer la réservation
  const handleReservation = async () => {
    if (!movie || !selectedDate) {
      toast.error("Veuillez sélectionner une date et une heure");
      return;
    }

    if (!isAuthenticated) {
      navigate(`/login?redirect=/movies/${movie.id}`);
      return;
    }

    try {
      setIsReserving(true);
      const reservationDateTime = getReservationDateTime();
      
      // Use the real API call
      await reservationService.createReservation({
        movieId: movie.id,
        reservationDate: reservationDateTime.toISOString()
      });
      
      toast.success("Réservation effectuée avec succès");
      setDialogOpen(false);
      navigate("/reservations");
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Erreur lors de la réservation");
    } finally {
      setIsReserving(false);
    }
  };

  // Heures disponibles (simulées)
  const availableTimes = ["14:00", "16:30", "18:00", "20:30", "22:15"];

  // Rendu pendant le chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster de film - Squelette */}
          <div className="md:w-1/3">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          </div>

          {/* Détails du film - Squelette */}
          <div className="md:w-2/3 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-40 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Film non trouvé</h1>
        <Button onClick={() => navigate("/movies")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste des films
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Backdrop en haut de la page */}
      <div className="relative h-64 md:h-96 bg-card overflow-hidden">
        {movie.backdrop_path && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-sm opacity-40"
            style={{
              backgroundImage: `url(${getImageUrl(movie.backdrop_path, "backdrop")})`,
            }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8 -mt-48 md:-mt-64 relative z-10">
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={() => navigate("/movies")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex flex-col md:flex-row gap-8 mt-4">
          {/* Poster du film */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Détails du film */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(movie.release_date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                })}
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {movie.runtime} min
              </div>
              
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-2" />
                {movie.vote_average ? (typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average) : '?'}/10
              </div>
              
              <div>
                {movie.genres && movie.genres.length > 0 ? 
                  movie.genres.map((genre) => genre.name).join(", ") : 
                  "Genre non spécifié"}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium mb-2">Synopsis</h2>
                <p className="text-muted-foreground">{movie.overview || "Pas de synopsis disponible"}</p>
              </div>
              
              <div className="pt-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg">Réserver maintenant</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Réserver pour {movie.title}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <h3 className="font-medium">Sélectionnez une date</h3>
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            // Désactiver les dates passées
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          locale={fr}
                          className="mx-auto p-3 pointer-events-auto"
                        />
                      </div>
                      
                      {selectedDate && (
                        <div className="grid gap-2">
                          <h3 className="font-medium">Sélectionnez une séance</h3>
                          <div className="flex flex-wrap gap-2">
                            {availableTimes.map((time) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                onClick={() => setSelectedTime(time)}
                                className="flex-1"
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button 
                          onClick={handleReservation} 
                          disabled={!selectedDate || isReserving}
                          className="w-full"
                        >
                          {isReserving ? (
                            "Réservation en cours..."
                          ) : (
                            `Confirmer la réservation pour le ${
                              selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : ""
                            } à ${selectedTime}`
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;