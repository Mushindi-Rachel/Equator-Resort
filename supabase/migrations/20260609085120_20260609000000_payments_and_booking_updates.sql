-- Add number_of_guests and booking_status to bookings if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS number_of_guests int DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_status text DEFAULT 'Pending';

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  pesapal_tracking_id text DEFAULT '',
  merchant_reference text DEFAULT '',
  payment_method text DEFAULT '',
  amount decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'KES',
  payment_status text DEFAULT 'Pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Payments policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_select_own' AND tablename = 'payments') THEN
    CREATE POLICY "payments_select_own" ON payments FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid())
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_select_admin' AND tablename = 'payments') THEN
    CREATE POLICY "payments_select_admin" ON payments FOR SELECT TO authenticated USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_insert_anon' AND tablename = 'payments') THEN
    CREATE POLICY "payments_insert_anon" ON payments FOR INSERT TO anon WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_insert_auth' AND tablename = 'payments') THEN
    CREATE POLICY "payments_insert_auth" ON payments FOR INSERT TO authenticated WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_update_admin' AND tablename = 'payments') THEN
    CREATE POLICY "payments_update_admin" ON payments FOR UPDATE TO authenticated USING (
      EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
  END IF;
END $$;

-- Allow anon insert on bookings for the public booking flow
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bookings_insert_anon' AND tablename = 'bookings') THEN
    CREATE POLICY "bookings_insert_anon" ON bookings FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;
