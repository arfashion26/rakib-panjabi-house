// ============================================
// Types for Rakib Panjabi House
// ============================================

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "STAFF"
  | "CUSTOMER";

export type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED"
  | "OUT_OF_STOCK"
  | "DISCONTINUED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "REFUNDED"
  | "FAILED";

export type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "PARTIALLY_PAID"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED"
  | "CANCELLED";

// Profile type (matches Supabase profiles table)
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  preferred_lang: string;
  preferred_currency: string;
  email_marketing_opt_in: boolean;
  sms_marketing_opt_in: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// Product type (matches products table)
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string | null;
  fabric: string | null;
  fit: string | null;
  care: string | null;
  origin: string | null;
  brand_id: string | null;
  category_id: string;
  price: number;
  discount_price: number | null;
  cost_price: number | null;
  currency: string;
  status: ProductStatus;
  type: "PHYSICAL" | "DIGITAL" | "SERVICE" | "BUNDLE";
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_flash_sale: boolean;
  allow_preorder: boolean;
  allow_reviews: boolean;
  allow_returns: boolean;
  meta_title: string | null;
  meta_description: string | null;
  search_keywords: string | null;
  video: string | null;
  weight_kg: number | null;
  published_at: string | null;
  flash_sale_start: string | null;
  flash_sale_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parent_id: string | null;
  order: number;
  is_featured: boolean;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  position: number;
  is_primary: boolean;
}

export interface ProductSize {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  sort_order: number;
}

export interface ProductColor {
  id: string;
  product_id: string;
  name: string;
  hex_value: string;
  image: string | null;
  stock: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
  selected_variant_id: string | null;
  added_at: string;
  // Joined data
  product?: Product;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Address {
  id: string;
  user_id: string;
  type: "SHIPPING" | "BILLING" | "BOTH";
  first_name: string;
  last_name: string | null;
  phone: string;
  alt_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  district: string | null;
  thana: string | null;
  postal_code: string | null;
  country: string;
  is_default: boolean;
  label: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  fulfillment_status: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address_json: string;
  billing_address_json: string | null;
  shipping_method: string | null;
  shipping_provider: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  payment_method: string | null;
  paid_at: string | null;
  placed_at: string;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  is_verified: boolean;
  is_featured: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
  helpful_count: number;
  not_helpful_count: number;
  response: string | null;
  created_at: string;
  // Joined
  user?: { name: string | null; image: string | null };
}

// Cart with items (aggregate)
export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper to format price
export function formatPrice(amount: number, currency: string = "BDT"): string {
  const symbol = currency === "BDT" ? "৳" : currency === "USD" ? "$" : "";
  return `${symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

// Calculate discount percentage
export function calculateDiscount(
  price: number,
  discountPrice: number | null
): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

// Check if product is on flash sale (within time window)
export function isFlashSaleActive(product: Product): boolean {
  if (!product.is_flash_sale) return false;
  if (!product.flash_sale_start || !product.flash_sale_end) return true;
  const now = new Date();
  const start = new Date(product.flash_sale_start);
  const end = new Date(product.flash_sale_end);
  return now >= start && now <= end;
}
