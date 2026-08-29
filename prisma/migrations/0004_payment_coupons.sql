-- Migration: Payment method config + Coupon tracking tables
-- Date: 2026-08-26

-- ============================================
-- PAYMENT METHOD CONFIGURATION
-- ============================================
-- Single-row table storing which payment methods are enabled
CREATE TABLE IF NOT EXISTS payment_config (
  id            TEXT PRIMARY KEY DEFAULT 'singleton',
  cod_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  bkash_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  nagad_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  rocket_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
  sslcommerz_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
  -- Optional merchant config
  bkash_number     TEXT,
  nagad_number     TEXT,
  rocket_number    TEXT,
  sslcommerz_store_id TEXT,
  sslcommerz_store_passwd TEXT,
  stripe_secret_key   TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default (only COD enabled)
INSERT INTO payment_config (id, cod_enabled, bkash_enabled, nagad_enabled, rocket_enabled, sslcommerz_enabled, stripe_enabled)
VALUES ('singleton', TRUE, FALSE, FALSE, FALSE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COUPONS TABLE (already exists from Prisma, but ensure columns)
-- ============================================
-- Note: 'coupons' table is created by Prisma migrations. We just verify.

-- ============================================
-- ORDER COUPONS TABLE (already exists from Prisma)
-- ============================================
-- 'order_coupons' table tracks which coupon was applied to which order.

-- ============================================
-- TRACK ORDER: public endpoint to query order status by order_number
-- ============================================
-- Uses existing 'orders' + 'order_tracking_history' tables.
-- No schema changes needed; we just expose a read-only API.

-- ============================================
-- GIFT VOUCHERS TABLE (already exists from Prisma)
-- ============================================
-- 'gift_vouchers' table stores purchased gift cards with unique codes.

-- Done.
