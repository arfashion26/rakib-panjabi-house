-- ============================================
-- Rakib Panjabi House - Complete Database Schema
-- Database: Supabase PostgreSQL
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK', 'DISCONTINUED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('PHYSICAL', 'DIGITAL', 'SERVICE', 'BUNDLE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('UNPAID', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'PARTIALLY_REFUNDED', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE fulfillment_status AS ENUM ('UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'RETURNED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE refund_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE address_type AS ENUM ('SHIPPING', 'BILLING', 'BOTH');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE coupon_type AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_X_GET_Y');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE coupon_applies_to AS ENUM ('ALL', 'SPECIFIC_CATEGORIES', 'SPECIFIC_PRODUCTS', 'SPECIFIC_BRANDS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SPAM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE banner_position AS ENUM ('HOMEPAGE_HERO', 'HOMEPAGE_PROMO', 'HOMEPAGE_FEATURED', 'SHOP_PAGE', 'CATEGORY_PAGE', 'SIDEBAR', 'FOOTER', 'ANNOUNCEMENT', 'POPUP');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE comment_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SPAM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  phone TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'CUSTOMER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  preferred_lang TEXT NOT NULL DEFAULT 'en',
  preferred_currency TEXT NOT NULL DEFAULT 'BDT',
  email_marketing_opt_in BOOLEAN NOT NULL DEFAULT true,
  sms_marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role_status ON profiles(role, status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, image)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_parent_active ON categories(parent_id, is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================
-- BRANDS
-- ============================================

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo TEXT,
  website TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  fabric TEXT,
  fit TEXT,
  care TEXT,
  origin TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  currency TEXT NOT NULL DEFAULT 'BDT',
  status product_status NOT NULL DEFAULT 'DRAFT',
  type product_type NOT NULL DEFAULT 'PHYSICAL',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_flash_sale BOOLEAN NOT NULL DEFAULT false,
  allow_preorder BOOLEAN NOT NULL DEFAULT false,
  allow_reviews BOOLEAN NOT NULL DEFAULT true,
  allow_returns BOOLEAN NOT NULL DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  search_keywords TEXT,
  video TEXT,
  weight_kg DECIMAL(8, 2),
  published_at TIMESTAMPTZ,
  flash_sale_start TIMESTAMPTZ,
  flash_sale_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category_id, status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(is_best_seller, status);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival, status);
CREATE INDEX IF NOT EXISTS idx_products_flash_sale ON products(is_flash_sale, status);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);

-- ============================================
-- PRODUCT IMAGES, VARIANTS, SIZES, COLORS, SPECS, TAGS
-- ============================================

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(is_primary);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT,
  price DECIMAL(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  weight_kg DECIMAL(8, 2),
  is_active BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, size)
);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product ON product_sizes(product_id);

CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hex_value TEXT NOT NULL,
  image TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, name)
);
CREATE INDEX IF NOT EXISTS idx_product_colors_product ON product_colors(product_id);

CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_product_specs_product ON product_specifications(product_id);

CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(product_id, tag)
);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);

CREATE TABLE IF NOT EXISTS product_frequently_bought_together (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  frequency INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, related_id)
);

-- ============================================
-- BUNDLES
-- ============================================

CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  image TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(bundle_id, product_id)
);

CREATE TABLE IF NOT EXISTS bundle_products (
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);

-- ============================================
-- CART
-- ============================================

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_size TEXT,
  selected_color TEXT,
  selected_variant_id UUID,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cart_id, product_id, selected_size, selected_color)
);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- ============================================
-- WISHLIST & COMPARE & RECENTLY VIEWED
-- ============================================

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);

CREATE TABLE IF NOT EXISTS compare_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_compare_user ON compare_items(user_id);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_time ON recently_viewed(user_id, viewed_at);

-- ============================================
-- ADDRESSES
-- ============================================

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type address_type NOT NULL DEFAULT 'SHIPPING',
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT NOT NULL,
  alt_phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  district TEXT,
  thana TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'Bangladesh',
  is_default BOOLEAN NOT NULL DEFAULT false,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_type ON addresses(user_id, type);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  status order_status NOT NULL DEFAULT 'PENDING',
  payment_status payment_status NOT NULL DEFAULT 'UNPAID',
  fulfillment_status fulfillment_status NOT NULL DEFAULT 'UNFULFILLED',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  shipping_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address_json TEXT NOT NULL,
  billing_address_json TEXT,
  shipping_method TEXT,
  shipping_provider TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  payment_method TEXT,
  payment_id TEXT,
  payment_transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  customer_note TEXT,
  admin_note TEXT,
  cancellation_reason TEXT,
  source TEXT NOT NULL DEFAULT 'WEB',
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status_payment ON orders(status, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_placed_at ON orders(placed_at);

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'RPH-' || TO_CHAR(now(), 'YYMMDD') || '-' || LPAD((EXTRACT(EPOCH FROM now())::bigint % 100000)::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE PROCEDURE generate_order_number();

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  image TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  selected_size TEXT,
  selected_color TEXT,
  selected_variant_id UUID,
  product_snapshot JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE TABLE IF NOT EXISTS order_tracking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  location TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_tracking_order_time ON order_tracking_history(order_id, timestamp);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  transaction_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  status TEXT NOT NULL,
  method TEXT,
  raw_response JSONB,
  error_message TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_tx_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_tx_id ON payment_transactions(transaction_id);

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status refund_status NOT NULL DEFAULT 'PENDING',
  processed_by TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- ============================================
-- COUPONS & GIFT VOUCHERS
-- ============================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type coupon_type NOT NULL DEFAULT 'PERCENTAGE',
  value DECIMAL(10, 2) NOT NULL,
  min_order DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  usage_limit INTEGER,
  per_user_limit INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  applies_to coupon_applies_to NOT NULL DEFAULT 'ALL',
  category_ids TEXT[] DEFAULT '{}',
  product_ids TEXT[] DEFAULT '{}',
  first_time_only BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coupons_code_active ON coupons(code, is_active);

CREATE TABLE IF NOT EXISTS order_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  code TEXT NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_order_coupons_order ON order_coupons(order_id);

CREATE TABLE IF NOT EXISTS gift_vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  recipient_email TEXT,
  recipient_name TEXT,
  sender_name TEXT,
  message TEXT,
  expires_at TIMESTAMPTZ,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  redeemed_by_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gift_vouchers_code ON gift_vouchers(code);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status review_status NOT NULL DEFAULT 'PENDING',
  helpful_count INTEGER NOT NULL DEFAULT 0,
  not_helpful_count INTEGER NOT NULL DEFAULT 0,
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id, order_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_status ON reviews(product_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================
-- BANNERS
-- ============================================

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  mobile_image TEXT,
  link_url TEXT,
  link_text TEXT,
  position banner_position NOT NULL DEFAULT 'HOMEPAGE_HERO',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_banners_position_active ON banners(position, is_active);

-- ============================================
-- BLOG
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES profiles(id),
  status blog_status NOT NULL DEFAULT 'DRAFT',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status_published ON blog_posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts(is_featured);

CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  content TEXT NOT NULL,
  status comment_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_status ON blog_comments(post_id, status);

-- ============================================
-- NOTIFICATIONS & SUPPORT
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'OPEN',
  priority ticket_priority NOT NULL DEFAULT 'NORMAL',
  assigned_to TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tickets_user_status ON support_tickets(user_id, status);

-- ============================================
-- SETTINGS
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL DEFAULT 'WEBSITE',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB
);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================
-- UPDATED_AT TRIGGER (auto-update on row change)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles', 'categories', 'brands', 'products', 'product_variants',
      'bundles', 'carts', 'addresses', 'orders', 'coupons', 'reviews',
      'banners', 'blog_posts', 'support_tickets', 'settings'
    ])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON %I;
      CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    ', tbl, tbl);
  END LOOP;
END $$;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read policies (catalog is public)
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can view product variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view product sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public can view product colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public can view product specs" ON product_specifications FOR SELECT USING (true);
CREATE POLICY "Public can view product tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Public can view active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public can view approved comments" ON blog_comments FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Public can view active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- User-specific policies (auth.uid() = user's id)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON carts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

CREATE POLICY "Users can manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own compare" ON compare_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recently viewed" ON recently_viewed FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can write own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA: Default Categories
-- ============================================

INSERT INTO categories (name, slug, description, is_featured, is_active, "order") VALUES
  ('Panjabi Collection', 'panjabi-collection', 'Premium panjabis crafted with the finest fabrics', true, true, 1),
  ('Shirts', 'shirts', 'Formal and casual shirts for every occasion', true, true, 2),
  ('T-Shirts', 't-shirts', 'Comfortable and stylish t-shirts', false, true, 3),
  ('Polo Shirts', 'polo-shirts', 'Classic polo shirts for a refined look', false, true, 4),
  ('Jeans', 'jeans', 'Premium denim in various fits and washes', false, true, 5),
  ('Pants', 'pants', 'Formal and casual pants', false, true, 6),
  ('Trousers', 'trousers', 'Refined trousers for the modern man', false, true, 7),
  ('Blazers', 'blazers', 'Elegant blazers for formal occasions', true, true, 8),
  ('Waistcoats', 'waistcoats', 'Stylish waistcoats to complete your look', false, true, 9),
  ('Hoodies', 'hoodies', 'Comfortable hoodies for casual wear', false, true, 10),
  ('Jackets', 'jackets', 'Premium jackets for all seasons', false, true, 11),
  ('Punjabi Pajama', 'punjabi-pajama', 'Traditional pajamas to pair with your panjabi', false, true, 12),
  ('Sherwani', 'sherwani', 'Royal sherwanis for weddings and special occasions', true, true, 13),
  ('Kids Collection', 'kids-collection', 'Stylish clothing for the little ones', false, true, 14),
  ('Women Collection', 'women-collection', 'Elegant fashion for women', false, true, 15),
  ('Accessories', 'accessories', 'Complete your look with premium accessories', false, true, 16)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: Default Settings
-- ============================================

INSERT INTO settings (key, value, type, description) VALUES
  ('site_name', 'Rakib Panjabi House', 'string', 'Site display name'),
  ('site_tagline', 'Premium Panjabi & Fashion for the Modern Gentleman', 'string', 'Site tagline'),
  ('site_description', 'Premium quality Panjabis, shirts, pants, and ethnic wear with timeless elegance and modern designs.', 'string', 'Site meta description'),
  ('currency', 'BDT', 'string', 'Default currency code'),
  ('currency_symbol', '৳', 'string', 'Currency display symbol'),
  ('default_language', 'en', 'string', 'Default site language'),
  ('min_order_free_shipping', '2000', 'number', 'Minimum order value for free shipping'),
  ('flat_shipping_rate', '80', 'number', 'Flat shipping rate inside Dhaka'),
  ('outside_dhaka_shipping', '130', 'number', 'Shipping rate outside Dhaka'),
  ('free_shipping_enabled', 'true', 'boolean', 'Enable free shipping'),
  ('cod_enabled', 'true', 'boolean', 'Enable Cash on Delivery'),
  ('cod_charge', '50', 'number', 'Extra charge for COD'),
  ('tax_rate', '0', 'number', 'Tax rate percentage (0 = no tax)'),
  ('contact_email', 'support@rakibpanjabihouse.com', 'string', 'Customer support email'),
  ('contact_phone', '+880 1XXX-XXXXXX', 'string', 'Customer support phone'),
  ('whatsapp_number', '+880 1XXX-XXXXXX', 'string', 'WhatsApp business number'),
  ('address', 'Dhaka, Bangladesh', 'string', 'Store address'),
  ('facebook_url', 'https://facebook.com/rakibpanjabihouse', 'string', 'Facebook page URL'),
  ('instagram_url', 'https://instagram.com/rakibpanjabihouse', 'string', 'Instagram profile URL'),
  ('youtube_url', 'https://youtube.com/@rakibpanjabihouse', 'string', 'YouTube channel URL'),
  ('announcement_bar_text', '✦ Free shipping on orders over ৳2000 — Shop the New Collection Today ✦', 'string', 'Top announcement bar text'),
  ('announcement_bar_enabled', 'true', 'boolean', 'Show announcement bar'),
  ('maintenance_mode', 'false', 'boolean', 'Site under maintenance'),
  ('allow_guest_checkout', 'true', 'boolean', 'Allow checkout without account'),
  ('allow_registration', 'true', 'boolean', 'Allow new user registration')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- DONE! Database schema is ready.
-- ============================================
