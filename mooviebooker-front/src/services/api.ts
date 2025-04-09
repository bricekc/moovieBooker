import { toast } from "sonner";

// API base URL - Cette URL serait remplacée par l'URL réelle de votre API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API token management
let authToken: string | null = null;

export const setToken = (token: string) => {
  authToken = token;
  localStorage.setItem("mooviebooker_token", token);
};

export const getToken = (): string | null => {
  if (!authToken) {
    authToken = localStorage.getItem("mooviebooker_token");
  }
  return authToken;
};

export const removeToken = () => {
  authToken = null;
  localStorage.removeItem("mooviebooker_token");
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // For DELETE requests with no content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle errors based on status code
      const errorMessage = data.message || "Une erreur est survenue";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error(error instanceof Error ? error.message : "Erreur réseau");
    throw error;
  }
};

// Mock image URL creator for demo purposes
// Dans un environnement réel, cette URL viendrait de votre backend
export const getImageUrl = (
  path: string,
  size: "poster" | "backdrop" = "poster"
) => {
  const baseUrl = "https://image.tmdb.org/t/p";
  const imageSize = size === "poster" ? "w500" : "original";

  return path ? `${baseUrl}/${imageSize}${path}` : "/placeholder.svg";
};
