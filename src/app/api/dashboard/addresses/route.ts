import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

async function getCurrentUser() {
  const supabase = await createServerClientHelper();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * GET /api/dashboard/addresses
 * Fetch current user's addresses
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, addresses: data || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/dashboard/addresses
 * Add a new address
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const admin = createAdminClient();

    // If this is the first address, make it default
    const { count } = await admin
      .from("addresses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const isDefault = count === 0 ? true : body.is_default || false;

    // If setting as default, unset other defaults
    if (isDefault) {
      await admin
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await admin
      .from("addresses")
      .insert({
        user_id: user.id,
        type: "SHIPPING",
        first_name: body.first_name,
        last_name: body.last_name || null,
        phone: body.phone,
        address_line1: body.address_line1,
        address_line2: body.address_line2 || null,
        city: body.city,
        district: body.district || null,
        thana: body.thana || null,
        postal_code: body.postal_code || null,
        country: "Bangladesh",
        is_default: isDefault,
        label: body.label || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, address: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/dashboard/addresses?id=xxx
 * Update an address
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("id");
    if (!addressId) {
      return NextResponse.json({ success: false, error: "Address ID required" }, { status: 400 });
    }

    const body = await request.json();
    const admin = createAdminClient();

    const updateData: any = {};
    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address_line1 !== undefined) updateData.address_line1 = body.address_line1;
    if (body.address_line2 !== undefined) updateData.address_line2 = body.address_line2;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.district !== undefined) updateData.district = body.district;
    if (body.thana !== undefined) updateData.thana = body.thana;
    if (body.postal_code !== undefined) updateData.postal_code = body.postal_code;
    if (body.label !== undefined) updateData.label = body.label;

    // Handle default
    if (body.is_default === true) {
      await admin.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      updateData.is_default = true;
    }

    const { error } = await admin
      .from("addresses")
      .update(updateData)
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/dashboard/addresses?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("id");
    if (!addressId) {
      return NextResponse.json({ success: false, error: "Address ID required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
