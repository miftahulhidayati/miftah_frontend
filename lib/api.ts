import axios from 'axios';
import { ApiResponse, Unit, MeetingRoom, Consumption, BookingListResponse, CreateBookingRequest, Booking, AvailabilityResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Master Data APIs
export const fetchUnits = async (): Promise<Unit[]> => {
  const response = await api.get<ApiResponse<Unit[]>>('/units');
  return response.data.data;
};

export const fetchRooms = async (): Promise<MeetingRoom[]> => {
  const response = await api.get<ApiResponse<MeetingRoom[]>>('/rooms');
  return response.data.data;
};

export const fetchConsumptions = async (): Promise<Consumption[]> => {
  const response = await api.get<ApiResponse<Consumption[]>>('/consumptions');
  return response.data.data;
};

// Booking APIs
export const fetchBookings = async (params?: {
  page?: number;
  limit?: number;
  unit_id?: number;
  room_id?: number;
  date_from?: string;
  date_to?: string;
}): Promise<BookingListResponse> => {
  const response = await api.get<ApiResponse<BookingListResponse>>('/bookings', { params });
  return response.data.data;
};

export const createBooking = async (booking: CreateBookingRequest): Promise<Booking> => {
  const response = await api.post<ApiResponse<Booking>>('/bookings', booking);
  return response.data.data;
};

export const checkAvailability = async (params: {
  room_id: string | number;
  date: string;
  start_time: string;
  end_time: string;
  participants?: string | number;
}): Promise<AvailabilityResponse> => {
  const response = await api.get<ApiResponse<AvailabilityResponse>>('/bookings/availability', { params });
  return response.data.data;
};