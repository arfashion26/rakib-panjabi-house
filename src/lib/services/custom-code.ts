"use server";

import { createAdminClient } from "@/lib/supabase";
import { DEFAULT_CUSTOM_CODE, CODE_KEYS, type CustomCode } from "@/lib/custom-code-config";

/**
 * Fetch the custom tracking code from the `settings` table.
 * Called from layout.tsx (server component) at request time.
 *
 * Uses the admin client to bypass RLS — these are store-wide settings,
 * not user-specific data, and they must render on every page for all
 * visitors (including anonymous ones).
 */
export async function getCustomCode(): Promise<CustomCode> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("settings")
      .select("key,value")
      .in("key", Object.values(CODE_KEYS));

    if (error || !data) {
      return DEFAULT_CUSTOM_CODE;
    }

    const code: CustomCode = { ...DEFAULT_CUSTOM_CODE };
    for (const row of data) {
      if (row.key === CODE_KEYS.head) code.head = row.value || "";
      else if (row.key === CODE_KEYS.body_top) code.body_top = row.value || "";
      else if (row.key === CODE_KEYS.body_bottom) code.body_bottom = row.value || "";
    }
    return code;
  } catch {
    return DEFAULT_CUSTOM_CODE;
  }
}

/**
 * Update the custom tracking code (admin only).
 * Each position is stored as a separate row in the settings table.
 */
export async function updateCustomCode(code: Partial<CustomCode>): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const now = new Date().toISOString();

    const updates = [
      { key: CODE_KEYS.head, value: code.head ?? "" },
      { key: CODE_KEYS.body_top, value: code.body_top ?? "" },
      { key: CODE_KEYS.body_bottom, value: code.body_bottom ?? "" },
    ];

    for (const u of updates) {
      // Try update first
      const { data: existing } = await admin
        .from("settings")
        .select("key")
        .eq("key", u.key)
        .maybeSingle();

      if (existing) {
        const { error } = await admin
          .from("settings")
          .update({ value: u.value, updated_at: now })
          .eq("key", u.key);
        if (error) {
          console.error(`Failed to update ${u.key}:`, error.message);
        }
      } else {
        // Row doesn't exist — insert it
        const { error } = await admin.from("settings").insert({
          key: u.key,
          value: u.value,
          type: "text",
          description: "Custom tracking code snippet",
          updated_at: now,
        });
        if (error) {
          console.error(`Failed to insert ${u.key}:`, error.message);
        }
      }
    }
    return true;
  } catch (e) {
    console.error("updateCustomCode error:", e);
    return false;
  }
}
