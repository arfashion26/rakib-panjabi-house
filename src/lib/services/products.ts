"use server";

import { createServerClientHelper, createAdminClient } from "@/lib/supabase";
import type { Product, Category, ProductImage, Review } from "@/lib/types";

/**
 * Check if the database is ready (tables exist and accessible).
 */
export async function isDatabaseReady(): Promise<boolean> {
  try {
    const supabase = await createServerClientHelper();
    const { count, error } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Fetch all active categories from database.
 *
 * Sorted by the `order` column (DB-side). Use `sortCategoriesByHomepageOrder`
 * to apply the admin-configured homepage display order on top.
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClientHelper();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("order", { ascending: true });

  if (error || !data) return [];
  return data as Category[];
}

/**
 * Fetch the admin-configured homepage category order.
 * Stored as a JSON array of category IDs in the settings table under
 * the key `homepage_category_order`.
 *
 * Returns an empty array if not set or DB is unreachable.
 */
export async function getHomepageCategoryOrder(): Promise<string[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("settings")
      .select("value")
      .eq("key", "homepage_category_order")
      .maybeSingle();
    if (error || !data?.value) return [];
    const parsed = JSON.parse(data.value);
    return Array.isArray(parsed) ? parsed.filter((id: any) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Fetch categories pre-sorted by the admin-configured homepage display
 * order. Categories not in the order array fall to the end, keeping
 * their original relative order. Sub-categories stay grouped under
 * their parent.
 *
 * Convenience wrapper combining getCategories + getHomepageCategoryOrder
 * + the sortCategoriesByHomepageOrder helper from @/lib/category-order.
 */
export async function getHomepageOrderedCategories(): Promise<Category[]> {
  const [cats, order] = await Promise.all([
    getCategories(),
    getHomepageCategoryOrder(),
  ]);

  if (!order.length) return cats;

  // Sort using the pure helper (kept in a non-server-action file so it
  // doesn't need to be async).
  // Inline the logic here to avoid an extra import.
  const orderIndex = new Map<string, number>();
  order.forEach((id, idx) => orderIndex.set(id, idx));

  const mains = cats.filter((c) => !c.parent_id);
  const subs = cats.filter((c) => c.parent_id);

  const sortedMains = [...mains].sort((a, b) => {
    const ai = orderIndex.has(a.id) ? orderIndex.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const bi = orderIndex.has(b.id) ? orderIndex.get(b.id)! : Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });

  return [...sortedMains, ...subs];
}

/**
 * Fetch a single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createServerClientHelper();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data as Category;
}

/**
 * Fetch products with filters from database.
 */
export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popular" | "rating";
  limit?: number;
  offset?: number;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<{ products: any[]; total: number }> {
  const supabase = await createServerClientHelper();

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("status", "ACTIVE");

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    if (category) {
      query = query.eq("category_id", category.id);
    } else {
      return { products: [], total: 0 };
    }
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,search_keywords.ilike.%${filters.search}%`
    );
  }

  if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
  if (filters.isBestSeller !== undefined) query = query.eq("is_best_seller", filters.isBestSeller);
  if (filters.isNewArrival !== undefined) query = query.eq("is_new_arrival", filters.isNewArrival);
  if (filters.isFlashSale !== undefined) query = query.eq("is_flash_sale", filters.isFlashSale);

  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);

  switch (filters.sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("is_best_seller", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "rating":
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const limit = filters.limit || 12;
  const offset = filters.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) return { products: [], total: 0 };

  // For each product, fetch its sizes, colors, and images
  const productsWithVariants = await Promise.all(
    (data || []).map(async (product) => {
      const admin = createAdminClient();
      const [sizesRes, colorsRes, imagesRes] = await Promise.all([
        admin.from("product_sizes").select("*").eq("product_id", product.id).order("sort_order", { ascending: true }),
        admin.from("product_colors").select("*").eq("product_id", product.id),
        admin.from("product_images").select("*").eq("product_id", product.id).order("position", { ascending: true }),
      ]);
      return {
        ...product,
        sizes: sizesRes.data || [],
        colors: colorsRes.data || [],
        images: imagesRes.data || [],
        // For display compatibility
        rating: 0,
        review_count: 0,
      };
    })
  );

  return {
    products: productsWithVariants,
    total: count ?? 0,
  };
}

/**
 * Fetch a single product by slug with all related data.
 */
export async function getProductBySlug(slug: string): Promise<{
  product: any | null;
  images: ProductImage[];
  reviews: Review[];
  relatedProducts: any[];
}> {
  const supabase = await createServerClientHelper();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "ACTIVE")
    .single();

  if (error || !product) {
    return { product: null, images: [], reviews: [], relatedProducts: [] };
  }

  const admin = createAdminClient();
  const [sizesRes, colorsRes, imagesRes, reviewsRes, relatedRes, specsRes] = await Promise.all([
    admin.from("product_sizes").select("*").eq("product_id", product.id).order("sort_order", { ascending: true }),
    admin.from("product_colors").select("*").eq("product_id", product.id),
    admin.from("product_images").select("*").eq("product_id", product.id).order("position", { ascending: true }),
    admin.from("reviews").select(`*, user:profiles(name, image)`).eq("product_id", product.id).eq("status", "APPROVED").order("created_at", { ascending: false }).limit(20),
    admin.from("products").select("*").eq("category_id", product.category_id).eq("status", "ACTIVE").neq("id", product.id).limit(4),
    admin.from("product_specifications").select("name, value").eq("product_id", product.id),
  ]);

  // Fetch specs for related products
  const relatedWithVariants = await Promise.all(
    (relatedRes.data || []).map(async (rp) => {
      const [rSizes, rColors, rImages] = await Promise.all([
        admin.from("product_sizes").select("*").eq("product_id", rp.id).order("sort_order", { ascending: true }),
        admin.from("product_colors").select("*").eq("product_id", rp.id),
        admin.from("product_images").select("*").eq("product_id", rp.id).order("position", { ascending: true }),
      ]);
      return {
        ...rp,
        sizes: rSizes.data || [],
        colors: rColors.data || [],
        images: rImages.data || [],
        rating: 0,
        review_count: 0,
      };
    })
  );

  return {
    product: {
      ...product,
      sizes: sizesRes.data || [],
      colors: colorsRes.data || [],
      specifications: (specsRes.data || []).map((s: any) => ({ key: s.name, value: s.value })),
    },
    images: (imagesRes.data as ProductImage[]) || [],
    reviews: (reviewsRes.data as Review[]) || [],
    relatedProducts: relatedWithVariants || [],
  };
}

/**
 * Search products with autocomplete.
 */
export async function searchProducts(
  query: string,
  limit: number = 8
): Promise<{ id: string; name: string; slug: string; price: number; discount_price: number | null }[]> {
  if (!query || query.length < 2) return [];

  const supabase = await createServerClientHelper();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, discount_price")
    .eq("status", "ACTIVE")
    .or(`name.ilike.%${query}%,search_keywords.ilike.%${query}%`)
    .limit(limit);

  if (error || !data) return [];
  return data;
}
