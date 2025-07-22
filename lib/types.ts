// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Master Data Types
export interface Unit {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MeetingRoom {
  id: number;
  name: string;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consumption {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Booking Types
export interface Booking {
  id: number;
  unit_id: number;
  meeting_room_id: number;
  meeting_date: string;
  start_time: string;
  end_time: string;
  total_participants: number;
  total_consumption: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  unit: Unit;
  meeting_room: MeetingRoom;
  consumptions: Consumption[];
}

export interface CreateBookingRequest {
  unit_id: number;
  meeting_room_id: number;
  meeting_date: string;
  start_time: string;
  end_time: string;
  total_participants: number;
  total_consumption: number;
  consumption_ids: number[];
  notes?: string;
}

export interface BookingListResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AvailabilityResponse {
  available: boolean;
  conflicts: Booking[];
}