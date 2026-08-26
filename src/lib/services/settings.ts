"use server";

import { createServerClientHelper, createAdminClient } from "@/lib/supabase";
import { DEFAULT_PAYMENT_CONFIG, type PaymentConfig } from "@/lib/payment-config";

/**
 * Fetch the payment configuration from the `settings` table.
 * Falls back to defaults (COD only) if the DB is unreachable.
 */
export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    const supabase = await createServerClientHelper();
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
