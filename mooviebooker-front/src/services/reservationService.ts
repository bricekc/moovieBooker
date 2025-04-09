import { apiRequest } from "./api";
import { CreateReservationDto, Reservation } from "../types";

export const reservationService = {
  getReservations: async (): Promise<Reservation[]> => {
    return await apiRequest<Reservation[]>("/reservation");
  },

  getReservationById: async (id: string): Promise<Reservation> => {
    return await apiRequest<Reservation>(`/reservation/${id}`);
  },

  createReservation: async (
    data: CreateReservationDto
  ): Promise<Reservation> => {
    return await apiRequest<Reservation>("/reservation", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteReservation: async (id: string): Promise<void> => {
    await apiRequest(`/reservation/${id}`, {
      method: "DELETE",
    });
  },
};
