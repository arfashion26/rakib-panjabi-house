import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();
  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(profile.role)) return null;
  return profile;
}

/**
 * GET /api/admin/homepage-category-order
 * Returns the current homepage category display order (array of category IDs).
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
      .select("value")
      .eq("key", "homepage_category_order")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let order: string[] = [];
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed)) {
          order = parsed.filter((id: any) => typeof id === "string");
        }
      } catch {
        // Invalid JSON — return empty
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/homepage-category-order
 * Updates the homepage category display order.
 * Body: { order: string[] }  — array of category IDs in display order.
 */
export async function PUT(req: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { order } = body;

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { success: false, error: "order must be an array of category IDs" },
        { status: 400 }
      );
    }

    // Validate all entries are strings
    const cleanOrder = order.filter((id: any) => typeof id === "string");
    const value = JSON.stringify(cleanOrder);

    const admin = createAdminClient();
    const now = new Date().toISOString();

    // Upsert the setting
    const { data: existing } = await admin
      .from("settings")
      .select("key")
      .eq("key", "homepage_category_order")
      .maybeSingle();

    if (existing) {
      const { error } = await admin
        .from("settings")
        .update({ value, updated_at: now })
        .eq("key", "homepage_category_order");
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await admin.from("settings").insert({
        key: "homepage_category_order",
        value,
        type: "json",
        description: "homepage category display order",
        updated_at: now,
      });
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
    }

    // Purge caches so the new order appears immediately
    try {
      revalidatePath("/");
      revalidatePath("/", "layout");
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, order: cleanOrder });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
