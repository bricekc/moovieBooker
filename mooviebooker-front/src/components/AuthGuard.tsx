
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Afficher un écran de chargement pendant la vérification de l'authentification
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
