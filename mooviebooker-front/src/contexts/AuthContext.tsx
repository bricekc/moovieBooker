import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { authService } from "../services/authService";
import { getToken } from "../services/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie si l'utilisateur est déjà connecté au chargement de l'application
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Si un token est présent, essayons de récupérer l'utilisateur
        if (getToken()) {
          try {
            // Récupérer l'utilisateur depuis l'API
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            authService.logout();
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Appel à l'API réelle
      const response = await authService.login({ email, password });
      const userData = await authService.getCurrentUser();
      setUser(userData);      
      toast.success("Connexion réussie");
      setIsAuthenticated(true);
    } catch (error: any) {
      toast.error(error.message || "Échec de la connexion");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => {
    try {
      setIsLoading(true);
      
      // Appel à l'API réelle
      const response = await authService.register({ email, password, firstName, lastName });
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success("Inscription réussie");
    } catch (error: any) {
      toast.error(error.message || "Échec de l'inscription");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Déconnexion réussie");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};