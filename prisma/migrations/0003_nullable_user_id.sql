-- ============================================
-- Make orders.user_id nullable
-- This allows guest orders (when user creation fails)
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Also update the RLS policy to allow guest orders
DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Verify
SELECT column_name, is_nullable FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'user_id';
