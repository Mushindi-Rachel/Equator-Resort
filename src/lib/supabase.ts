import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export type Room = {
  id: number;
  room_number: string;
  name: string;
  category: string;
  description: string;
  price_per_night: number;
  size_sqm: number;
  capacity_adults: number;
  capacity_children: number;
  amenities: string[];
  images: string[];
  badge: string;
  is_available: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string | null;
  room_id: number;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  payment_method: string;
  mpesa_number: string;
  payment_status: string;
  total_amount: number;
  booking_reference: string;
  notes: string;
  confirmation_status: string;
  mpesa_transaction_id: string | null;
  mpesa_checkout_request_id: string | null;
  created_at: string;
  rooms?: Room;
  profiles?: Profile;
};
