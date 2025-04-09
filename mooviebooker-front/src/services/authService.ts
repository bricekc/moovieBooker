import { apiRequest, setToken, removeToken } from "./api";
import { AuthResponse, LoginDto, RegisterDto, User } from "../types";

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setToken(response.token);
    return response;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("Login response:", response);
    setToken(response.token);
    return response;
  },

  logout: (): void => {
    removeToken();
  },

  getCurrentUser: async (): Promise<User> => {
    return await apiRequest<User>("/user/me");
  },
};
