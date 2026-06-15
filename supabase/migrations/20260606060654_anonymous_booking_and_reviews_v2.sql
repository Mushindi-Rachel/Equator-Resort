-- Add confirmation_status column to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_status text DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mpesa_transaction_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS mpesa_checkout_request_id text;

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  guest_name text NOT NULL,
  guest_email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_select_published' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_select_published" ON reviews FOR SELECT TO anon, authenticated USING (is_published = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_select_admin' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_select_admin" ON reviews FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_insert_admin' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_insert_admin" ON reviews FOR INSERT TO authenticated WITH CHECK (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_update_admin' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_update_admin" ON reviews FOR UPDATE TO authenticated USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reviews_delete_admin' AND tablename = 'reviews') THEN
    CREATE POLICY "reviews_delete_admin" ON reviews FOR DELETE TO authenticated USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;
END $$;

-- Allow anon to check booking overlaps for availability
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bookings_select_anon' AND tablename = 'bookings') THEN
    CREATE POLICY "bookings_select_anon" ON bookings FOR SELECT TO anon USING (true);
  END IF;
END $$;