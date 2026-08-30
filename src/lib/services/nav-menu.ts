"use server";

import { createAdminClient } from "@/lib/supabase";

export interface NavMenuItem {
  id: string;
  label: string;
  label_bn: string;
  href: string;
  icon: string | null; // lucide icon name or null
  sort_order: number;
  is_active: boolean;
  open_in_new_tab: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_ITEMS: Omit<NavMenuItem, "id" | "created_at" | "updated_at">[] = [
  { label: "Home", label_bn: "হোম", href: "/", icon: null, sort_order: 0, is_active: true, open_in_new_tab: false },
  { label: "Shop", label_bn: "শপ", href: "/shop", icon: null, sort_order: 1, is_active: true, open_in_new_tab: false },
  { label: "New Arrivals", label_bn: "নতুন এসেছে", href: "/new-arrivals", icon: null, sort_order: 2, is_active: true, open_in_new_tab: false },
  { label: "Best Sellers", label_bn: "বেস্ট সেলার", href: "/best-sellers", icon: null, sort_order: 3, is_active: true, open_in_new_tab: false },
  { label: "Sale", label_bn: "সেল", href: "/sale", icon: null, sort_order: 4, is_active: true, open_in_new_tab: false },
  { label: "Lookbook", label_bn: "লুকবুক", href: "/lookbook", icon: null, sort_order: 5, is_active: true, open_in_new_tab: false },
  { label: "Blog", label_bn: "ব্লগ", href: "/blog", icon: null, sort_order: 6, is_active: true, open_in_new_tab: false },
  { label: "About Us", label_bn: "আমাদের সম্পর্কে", href: "/about", icon: null, sort_order: 7, is_active: true, open_in_new_tab: false },
  { label: "Contact", label_bn: "যোগাযোগ", href: "/contact", icon: null, sort_order: 8, is_active: true, open_in_new_tab: false },
];

/**
 * Fetch all active nav menu items, ordered by sort_order.
 * Called from SiteHeader (public).
 */
export async function getActiveNavItems(): Promise<NavMenuItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("nav_menu_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      // Fall back to defaults
      return DEFAULT_ITEMS.map((item, idx) => ({
        ...item,
        id: `default-${idx}`,
        created_at: "",
        updated_at: "",
      }));
    }
    return data as NavMenuItem[];
  } catch {
    return DEFAULT_ITEMS.map((item, idx) => ({
      ...item,
      id: `default-${idx}`,
      created_at: "",
      updated_at: "",
    }));
  }
}

/**
 * Fetch ALL nav items (including inactive) for admin.
 */
export async function getAllNavItems(): Promise<NavMenuItem[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("nav_menu_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as NavMenuItem[];
  } catch {
    return [];
  }
}

/**
 * Create a new nav item.
 */
export async function createNavItem(
  item: Omit<NavMenuItem, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("nav_menu_items").insert(item);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Update a nav item.
 */
export async function updateNavItem(
  id: string,
  updates: Partial<Omit<NavMenuItem, "id" | "created_at" | "updated_at">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("nav_menu_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Delete a nav item.
 */
export async function deleteNavItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("nav_menu_items").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Seed default nav items if the table is empty.
 */
export async function seedNavItems(): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: existing } = await admin
      .from("nav_menu_items")
      .select("id")
      .limit(1);

    if (existing && existing.length > 0) return;

    for (const item of DEFAULT_ITEMS) {
      await admin.from("nav_menu_items").insert(item);
    }
    console.log("Seeded default nav menu items");
  } catch (e) {
    console.error("Seed nav items error:", e);
  }
}
