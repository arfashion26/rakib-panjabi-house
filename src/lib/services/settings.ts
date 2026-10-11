"use server";

import { createAdminClient } from "@/lib/supabase";
import { DEFAULT_PAYMENT_CONFIG, type PaymentConfig } from "@/lib/payment-config";

/**
 * Fetch the payment configuration from the `settings` table.
 * Falls back to defaults (COD only) if the DB is unreachable.
 *
 * Uses the admin client to bypass RLS — the payment config is a
 * store-wide setting, not user-specific data.
 */
export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("settings")
      .select("key,value")
      .like("key", "payment_%");

    if (error || !data) {
      return DEFAULT_PAYMENT_CONFIG;
    }

    const config: any = { ...DEFAULT_PAYMENT_CONFIG };
    for (const row of data) {
      const key = row.key as keyof PaymentConfig;
      if (key in DEFAULT_PAYMENT_CONFIG) {
        config[key] = row.value === "true";
      }
    }
    return config as PaymentConfig;
  } catch {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

/**
 * Fetch brand assets (logo URL, favicon URL) from the settings table.
 * Falls back to defaults (/logo.jpg, /favicon.ico) if DB is unreachable
 * or no custom logo is set.
 *
 * Used by the Logo component (server-side) and the root layout (favicon).
 */
export async function getBrandAssets(): Promise<{
  logoUrl: string;
  faviconUrl: string;
  usdRate: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
}> {
  const DEFAULTS = {
    logoUrl: "/logo.png",
    faviconUrl: "/logo.png",
    usdRate: 110,
    metaTitle: "Rakib Panjabi House — Premium Panjabi & Fashion for Men",
    metaDescription: "Discover premium quality Panjabis, shirts, pants, and ethnic wear at Rakib Panjabi House. Shop the latest collections with timeless elegance and modern designs. Free shipping across Bangladesh.",
    metaKeywords: "Panjabi, Men's fashion, Panjabi House, Bangladesh fashion, Ethnic wear, Sherwani, Kurta, Panjabi online shop, Rakib Panjabi House, Premium fashion",
    ogTitle: "Rakib Panjabi House — Premium Panjabi & Fashion for Men",
    ogDescription: "Premium quality Panjabis, shirts, and ethnic wear with timeless elegance and modern designs.",
  };
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [
        "logo_url", "favicon_url", "usd_rate",
        "meta_title", "meta_description", "meta_keywords",
        "og_title", "og_description",
      ]);

    if (error || !data) return DEFAULTS;

    const out: any = { ...DEFAULTS };
    for (const row of data) {
      if (row.key === "logo_url" && row.value) out.logoUrl = row.value;
      if (row.key === "favicon_url" && row.value) out.faviconUrl = row.value;
      if (row.key === "usd_rate" && row.value) {
        const n = parseFloat(row.value);
        if (!isNaN(n) && n > 0) out.usdRate = n;
      }
      if (row.key === "meta_title" && row.value) out.metaTitle = row.value;
      if (row.key === "meta_description" && row.value) out.metaDescription = row.value;
      if (row.key === "meta_keywords" && row.value) out.metaKeywords = row.value;
      if (row.key === "og_title" && row.value) out.ogTitle = row.value;
      if (row.key === "og_description" && row.value) out.ogDescription = row.value;
    }
    return out;
  } catch {
    return DEFAULTS;
  }
}
/**
 * Update the payment configuration (admin only).
 */
export async function updatePaymentConfig(config: PaymentConfig): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const updates = Object.entries(config).map(([key, value]) => ({
      key: `payment_${key}`,
      value: String(value),
    }));

    for (const u of updates) {
      const { error } = await admin
        .from("settings")
        .update({ value: u.value, updated_at: new Date().toISOString() })
        .eq("key", u.key);
      if (error) {
        console.error(`Failed to update ${u.key}:`, error.message);
      }
    }
    return true;
  } catch (e) {
    console.error("updatePaymentConfig error:", e);
    return false;
  }
}
