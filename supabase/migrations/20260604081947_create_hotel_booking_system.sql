/*
  # Hotel Booking System Schema

  1. New Tables
    - `profiles` - User profile info linked to auth.users
      - id (uuid, FK to auth.users)
      - full_name, phone, email, is_admin, created_at
    - `rooms` - Hotel rooms catalog
      - id (int), room_number (text unique), name, category, description
      - price_per_night, size_sqm, capacity_adults, capacity_children
      - amenities (jsonb array), images (jsonb array), is_available
    - `bookings` - Room reservations
      - id (uuid), user_id (FK profiles), room_id (FK rooms)
      - check_in, check_out, adults, children
      - guest_name, guest_email, guest_phone
      - payment_method, mpesa_number, payment_status, total_amount
      - booking_reference, created_at, notes

  2. Security
    - RLS enabled on all tables
    - Users can read/update own profile
    - Users can read all rooms (public catalog)
    - Users can create bookings and view their own
    - Admins can view/manage all bookings and rooms

  3. Seed Data
    - 6 rooms seeded: Standard, Deluxe, Executive Suite, Family, Presidential, Waterfront
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id serial PRIMARY KEY,
  room_number text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Standard',
  description text DEFAULT '',
  price_per_night numeric(10,2) NOT NULL,
  size_sqm int DEFAULT 30,
  capacity_adults int DEFAULT 2,
  capacity_children int DEFAULT 0,
  amenities jsonb DEFAULT '[]',
  images jsonb DEFAULT '[]',
  badge text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can view rooms"
  ON rooms FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can insert rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  room_id int REFERENCES rooms(id) ON DELETE RESTRICT,
  check_in date NOT NULL,
  check_out date NOT NULL,
  adults int DEFAULT 1,
  children int DEFAULT 0,
  guest_name text NOT NULL DEFAULT '',
  guest_email text NOT NULL DEFAULT '',
  guest_phone text DEFAULT '',
  payment_method text DEFAULT 'mpesa',
  mpesa_number text DEFAULT '',
  payment_status text DEFAULT 'pending',
  total_amount numeric(10,2) DEFAULT 0,
  booking_reference text UNIQUE NOT NULL DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Seed rooms data
INSERT INTO rooms (room_number, name, category, description, price_per_night, size_sqm, capacity_adults, capacity_children, amenities, images, badge) VALUES
(
  '101',
  'Standard Room',
  'Standard',
  'A cozy and comfortable room featuring modern amenities and a beautiful garden view. Perfect for solo travelers or couples seeking a peaceful retreat.',
  150,
  35,
  2,
  1,
  '["Free WiFi","Smart TV","Breakfast Included","Hot Shower","Room Service","Air Conditioning","Mini Fridge","Safe"]',
  '["https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  ''
),
(
  '201',
  'Deluxe Room',
  'Deluxe',
  'An elevated experience with premium furnishings, a private balcony overlooking lush landscapes, and thoughtfully curated amenities for a luxurious stay.',
  280,
  55,
  2,
  2,
  '["Free WiFi","Smart TV","Breakfast Included","Hot Shower","Room Service","Air Conditioning","Mini Bar","Safe","Private Balcony","Bathtub"]',
  '["https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Popular'
),
(
  '301',
  'Executive Suite',
  'Suite',
  'Indulge in unmatched sophistication with a separate living area, panoramic views, and exclusive concierge services. The pinnacle of executive comfort.',
  520,
  90,
  3,
  1,
  '["Free WiFi","Smart TV","Breakfast Included","Hot Shower","Room Service","Air Conditioning","Full Bar","Safe","Private Balcony","Jacuzzi","Butler Service","Lounge Area","Nespresso Machine"]',
  '["https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/276671/pexels-photo-276671.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Signature'
),
(
  '401',
  'Family Room',
  'Family',
  'Thoughtfully designed for families, with interconnected sleeping areas, a spacious lounge, and child-friendly amenities ensuring comfort for every member.',
  380,
  75,
  2,
  3,
  '["Free WiFi","Smart TV","Breakfast Included","Hot Shower","Room Service","Air Conditioning","Mini Bar","Safe","Kids Corner","Extra Beds","Board Games","Baby Cot Available"]',
  '["https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Family Pick'
),
(
  '501',
  'Presidential Suite',
  'Suite',
  'The crown jewel of Equator Pastoral Resort. An expansive two-story suite with private pool, dedicated staff, and bespoke experiences tailored to your every desire.',
  1200,
  200,
  4,
  2,
  '["Free WiFi","Smart TV","Breakfast Included","Hot Shower","Room Service","Air Conditioning","Full Bar","Safe","Private Pool","Jacuzzi","Butler Service","Private Dining","Cinema Room","Gym Access","Spa Access","Airport Transfer"]',
  '["https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/2029698/pexels-photo-2029698.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Luxury'
),
(
  '601',
  'Waterfront Suite',
  'Suite',
  'Wake up to serene waterfront vistas from your private deck. This exceptional suite blends natural beauty with refined luxury for an unforgettable escape.',
  820,
  110,
  3,
  2,
  '["Free WiFi","Smart TV","Breakfast Included","Hot Shower","Room Service","Air Conditioning","Full Bar","Safe","Private Deck","Infinity Pool Access","Kayaking","Sunset Views","Outdoor Bath","Concierge"]',
  '["https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800","https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"]',
  'Waterfront'
)
ON CONFLICT (room_number) DO NOTHING;
