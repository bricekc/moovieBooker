import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/types";
import { reservationService } from "@/services/reservationService";
import ReservationCard from "@/components/ReservationCard";
import AuthGuard from "@/components/AuthGuard";
import { toast } from "sonner";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger les réservations
  const loadReservations = async () => {
    try {
      setLoading(true);
      
      // Utiliser l'API réelle avec await
      const data = await reservationService.getReservations();
      
      // Vérifier que data est un tableau, sinon utiliser un tableau vide
      const reservationsArray = Array.isArray(data) ? data : 
                               (data && data.reservations ? data.reservations : []);
      
      setReservations(reservationsArray);
    } catch (error) {
      console.error("Error loading reservations:", error);
      toast.error("Erreur lors du chargement des réservations");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Mes Réservations</h1>
          <Button onClick={() => navigate("/movies")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle réservation
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium">Aucune réservation</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Vous n'avez pas encore effectué de réservation. Parcourez nos films et réservez votre prochaine séance !
            </p>
            <Button onClick={() => navigate("/movies")} className="mt-4">
              Explorer les films
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancelled={loadReservations}
              />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default ReservationsPage;