import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();
  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN"].includes(profile.role)) return null;
  return profile;
}

/**
 * GET /api/admin/settings
 * Returns all store settings from the settings table.
 */
export async function GET() {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("settings")
      .select("key, value")
      .in("key", [
        "site_name", "tagline", "site_description",
        "contact_email", "contact_phone", "whatsapp_number", "address",
        "facebook_url", "instagram_url", "youtube_url", "twitter_url",
        "free_shipping_threshold", "cod_inside_dhaka", "cod_outside_dhaka",
      ]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Convert to key-value map
    const settings: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({ success: true, settings });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings
 * Updates store settings.
 * Body: { site_name, tagline, contact_email, ... }
 */
export async function PUT(req: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const admin = createAdminClient();
    const now = new Date().toISOString();

    // All known setting keys with their type
    const settingKeys: Record<string, string> = {
      site_name: "text",
      tagline: "text",
      site_description: "text",
      contact_email: "text",
      contact_phone: "text",
      whatsapp_number: "text",
      address: "text",
      facebook_url: "text",
      instagram_url: "text",
      youtube_url: "text",
      twitter_url: "text",
      free_shipping_threshold: "text",
      cod_inside_dhaka: "text",
      cod_outside_dhaka: "text",
    };

    // Upsert each setting
    for (const [key, type] of Object.entries(settingKeys)) {
      if (body[key] !== undefined) {
        const value = String(body[key]);

        // Check if exists
        const { data: existing } = await admin
          .from("settings")
          .select("key")
          .eq("key", key)
          .maybeSingle();

        if (existing) {
          await admin
            .from("settings")
            .update({ value, updated_at: now })
            .eq("key", key);
        } else {
          await admin.from("settings").insert({
            key,
            value,
            type,
            description: key.replace(/_/g, " "),
            updated_at: now,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
