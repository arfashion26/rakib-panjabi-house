"use server";

import { createAdminClient } from "@/lib/supabase";

/**
 * Homepage review (customer testimonial shown on the homepage).
 *
 * These are managed by admins from /admin/reviews — they are NOT
 * product reviews. Product reviews use the Review model and are
 * submitted by customers on product pages.
 */

export interface HomepageReview {
  id: string;
  customer_name: string;
  customer_location: string;
  product_name: string;
  rating: number;
  review_text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all active homepage reviews, ordered by sort_order.
 * Called from the homepage (public).
 */
export async function getActiveHomepageReviews(): Promise<HomepageReview[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("homepage_reviews")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as HomepageReview[];
  } catch {
    return [];
  }
}

/**
 * Fetch ALL homepage reviews (including inactive) for admin listing.
 */
export async function getAllHomepageReviews(): Promise<HomepageReview[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("homepage_reviews")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as HomepageReview[];
  } catch {
    return [];
  }
}

/**
 * Create a new homepage review.
 */
export async function createHomepageReview(
  review: Omit<HomepageReview, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("homepage_reviews").insert({
      customer_name: review.customer_name,
      customer_location: review.customer_location,
      product_name: review.product_name,
      rating: review.rating,
      review_text: review.review_text,
      is_active: review.is_active,
      sort_order: review.sort_order,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Update an existing homepage review.
 */
export async function updateHomepageReview(
  id: string,
  updates: Partial<Omit<HomepageReview, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("homepage_reviews")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Delete a homepage review permanently.
 */
export async function deleteHomepageReview(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("homepage_reviews").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
