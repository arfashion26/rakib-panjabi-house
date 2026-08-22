import { NextRequest, NextResponse } from "next/server";
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
    .select("id, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(profile.role)) return null;
  return profile;
}

/**
 * GET /api/admin/categories
 */
export async function GET() {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: categories, error } = await admin
      .from("categories")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, categories: categories || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Create a new category
 * Body: { name, slug?, description?, image?, icon?, parentId?, order?, isFeatured?, isActive?, seoTitle?, seoDescription? }
 */
export async function POST(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, image, icon, parentId, order, isFeatured, isActive, seoTitle, seoDescription } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const admin = createAdminClient();
    const { data: category, error } = await admin
      .from("categories")
      .insert({
        name,
        slug: finalSlug,
        description: description || null,
        image: image || null,
        icon: icon || null,
        parent_id: parentId || null,
        order: order || 0,
        is_featured: isFeatured || false,
        is_active: isActive !== undefined ? isActive : true,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/categories?id=xxx
 * Update a category
 */
export async function PUT(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Category ID required" }, { status: 400 });
    }

    const body = await request.json();
    const admin = createAdminClient();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.parentId !== undefined) updateData.parent_id = body.parentId;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isFeatured !== undefined) updateData.is_featured = body.isFeatured;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;
    if (body.seoTitle !== undefined) updateData.seo_title = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seo_description = body.seoDescription;

    const { error } = await admin.from("categories").update(updateData).eq("id", categoryId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories?id=xxx
 * Delete a category
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");
    if (!categoryId) {
      return NextResponse.json({ success: false, error: "Category ID required" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Check if any products are in this category
    const { count } = await admin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (count && count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category with ${count} products. Move or delete the products first.`,
        },
        { status: 400 }
      );
    }

    const { error } = await admin.from("categories").delete().eq("id", categoryId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
