-- ============================================
-- Make Your Account an Admin
-- ============================================
--
-- HOW TO USE:
-- 1. First, register an account on your website (https://rakib-panjabi-house.vercel.app/register)
--    OR login with Google OAuth
-- 2. Copy your email address you used to register
-- 3. Replace 'YOUR_EMAIL@example.com' below with your actual email
-- 4. Run this SQL in Supabase SQL Editor
-- 5. Logout and login again — you'll be redirected to /admin
--
-- ============================================

-- Replace the email below with YOUR registered email
UPDATE profiles
SET role = 'SUPER_ADMIN'
WHERE email = 'YOUR_EMAIL@example.com';

-- Verify it worked (should return 1 row with role = SUPER_ADMIN)
SELECT id, email, name, role, status FROM profiles
WHERE email = 'YOUR_EMAIL@example.com';

-- ============================================
-- Alternative: Make admin by phone number
-- (if you registered via guest checkout with phone)
-- ============================================
-- UPDATE profiles
-- SET role = 'SUPER_ADMIN'
-- WHERE phone = '+8801XXXXXXXXX';

-- ============================================
-- View all users and their roles
-- ============================================
-- SELECT id, email, name, phone, role, status, created_at
-- FROM profiles
-- ORDER BY created_at DESC
-- LIMIT 20;

-- ============================================
-- Promote a staff member (less permissions than admin)
-- ============================================
-- UPDATE profiles
-- SET role = 'STAFF'
-- WHERE email = 'staff@example.com';

-- ============================================
-- Demote back to customer
-- ============================================
-- UPDATE profiles
-- SET role = 'CUSTOMER'
-- WHERE email = 'someone@example.com';

-- ============================================
-- Suspend a user (block login)
-- ============================================
-- UPDATE profiles
-- SET status = 'SUSPENDED'
-- WHERE email = 'baduser@example.com';
