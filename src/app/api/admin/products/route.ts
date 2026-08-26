import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

/**
 * Verify that the current user is an admin (SUPER_ADMIN, ADMIN, MANAGER, or STAFF).
 * Returns the user's profile or null if not authorized.
 */
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
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(profile.role)) {
    return null;
  }
  return profile;
}

/**
 * GET /api/admin/products
 * Fetch all products (including drafts, archived) with their variants
 */
export async function GET() {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Fetch products
    const { data: products, error } = await admin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // For each product, fetch its sizes and colors
    const productsWithVariants = await Promise.all(
      (products || []).map(async (product) => {
        const [sizesRes, colorsRes, imagesRes] = await Promise.all([
          admin
            .from("product_sizes")
            .select("*")
            .eq("product_id", product.id)
            .order("sort_order", { ascending: true }),
          admin
            .from("product_colors")
            .select("*")
            .eq("product_id", product.id),
          admin
            .from("product_images")
            .select("*")
            .eq("product_id", product.id)
            .order("position", { ascending: true }),
        ]);

        return {
          ...product,
          sizes: sizesRes.data || [],
          colors: colorsRes.data || [],
          images: imagesRes.data || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      products: productsWithVariants,
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create a new product with sizes, colors (each with stock), and images
 */
export async function POST(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN and SUPER_ADMIN can create products
    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(adminProfile.role)) {
      return NextResponse.json(
        { success: false, error: "Only admins and managers can create products" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      fabric,
      fit,
      care,
      origin,
      brandId,
      categoryId,
      price,
      discountPrice,
      costPrice,
      status,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isFlashSale,
      metaTitle,
      metaDescription,
      searchKeywords,
      sizes, // Array of { size, stock, sortOrder }
      colors, // Array of { name, hexValue, stock }
      images, // Array of { url, altText, isPrimary }
    } = body;

    // Validate required fields
    if (!name || !sku || !description || !categoryId || !price) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, sku, description, categoryId, price" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Generate slug from name if not provided
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Create the product
    const { data: product, error: productError } = await admin
      .from("products")
      .insert({
        name,
        slug: finalSlug,
        sku,
        description,
        short_description: shortDescription || null,
        fabric: fabric || null,
        fit: fit || null,
        care: care || null,
        origin: origin || null,
        brand_id: brandId || null,
        category_id: categoryId,
        price: parseFloat(price),
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        cost_price: costPrice ? parseFloat(costPrice) : null,
        currency: "BDT",
        status: status || "DRAFT",
        type: "PHYSICAL",
        is_featured: isFeatured || false,
        is_best_seller: isBestSeller || false,
        is_new_arrival: isNewArrival || false,
        is_flash_sale: isFlashSale || false,
        allow_preorder: false,
        allow_reviews: true,
        allow_returns: true,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        search_keywords: searchKeywords || null,
        published_at: status === "ACTIVE" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (productError) {
      return NextResponse.json(
        { success: false, error: productError.message },
        { status: 400 }
      );
    }

    // Insert sizes (if provided)
    if (sizes && sizes.length > 0) {
      const sizesToInsert = sizes.map((s: any, idx: number) => ({
        product_id: product.id,
        size: s.size,
        stock: parseInt(s.stock) || 0,
        sort_order: s.sortOrder ?? idx,
      }));
      await admin.from("product_sizes").insert(sizesToInsert);
    }

    // Insert colors (if provided)
    if (colors && colors.length > 0) {
      const colorsToInsert = colors.map((c: any) => ({
        product_id: product.id,
        name: c.name,
        hex_value: c.hexValue,
        stock: parseInt(c.stock) || 0,
      }));
      await admin.from("product_colors").insert(colorsToInsert);
    }

    // Insert images (if provided)
    if (images && images.length > 0) {
      const imagesToInsert = images.map((img: any, idx: number) => ({
        product_id: product.id,
        url: img.url,
        alt_text: img.altText || name,
        is_primary: img.isPrimary || idx === 0,
        position: idx,
      }));
      await admin.from("product_images").insert(imagesToInsert);
    }

    return NextResponse.json({
      success: true,
      product: { id: product.id, slug: product.slug, sku: product.sku },
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products?id=xxx
 * Delete a product (cascade deletes sizes, colors, images)
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(adminProfile.role)) {
      return NextResponse.json(
        { success: false, error: "Only admins and managers can delete products" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // First delete all related records (to avoid foreign key constraints)
    await admin.from("product_images").delete().eq("product_id", productId);
    await admin.from("product_sizes").delete().eq("product_id", productId);
    await admin.from("product_colors").delete().eq("product_id", productId);
    await admin.from("product_specifications").delete().eq("product_id", productId);
    await admin.from("product_tags").delete().eq("product_id", productId);
    await admin.from("cart_items").delete().eq("product_id", productId);
    await admin.from("wishlist_items").delete().eq("product_id", productId);
    await admin.from("compare_items").delete().eq("product_id", productId);
    await admin.from("recently_viewed").delete().eq("product_id", productId);

    // Now delete the product
    const { error } = await admin.from("products").delete().eq("id", productId);

    if (error) {
      console.error("Delete product DB error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products?id=xxx
 * Update an existing product
 */
export async function PUT(request: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(adminProfile.role)) {
      return NextResponse.json(
        { success: false, error: "Only admins and managers can update products" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const admin = createAdminClient();

    // Update product fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.sku !== undefined) updateData.sku = body.sku;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.short_description = body.shortDescription;
    if (body.fabric !== undefined) updateData.fabric = body.fabric;
    if (body.fit !== undefined) updateData.fit = body.fit;
    if (body.care !== undefined) updateData.care = body.care;
    if (body.origin !== undefined) updateData.origin = body.origin;
    if (body.brandId !== undefined) updateData.brand_id = body.brandId;
    if (body.categoryId !== undefined) updateData.category_id = body.categoryId;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.discountPrice !== undefined) updateData.discount_price = body.discountPrice ? parseFloat(body.discountPrice) : null;
    if (body.costPrice !== undefined) updateData.cost_price = body.costPrice ? parseFloat(body.costPrice) : null;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "ACTIVE" && !body.publishedAt) {
        updateData.published_at = new Date().toISOString();
      }
    }
    if (body.isFeatured !== undefined) updateData.is_featured = body.isFeatured;
    if (body.isBestSeller !== undefined) updateData.is_best_seller = body.isBestSeller;
    if (body.isNewArrival !== undefined) updateData.is_new_arrival = body.isNewArrival;
    if (body.isFlashSale !== undefined) updateData.is_flash_sale = body.isFlashSale;
    if (body.metaTitle !== undefined) updateData.meta_title = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.meta_description = body.metaDescription;
    if (body.searchKeywords !== undefined) updateData.search_keywords = body.searchKeywords;

    const { error: updateError } = await admin
      .from("products")
      .update(updateData)
      .eq("id", productId);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    }

    // Update sizes (replace all)
    if (body.sizes !== undefined) {
      await admin.from("product_sizes").delete().eq("product_id", productId);
      if (body.sizes.length > 0) {
        await admin.from("product_sizes").insert(
          body.sizes.map((s: any, idx: number) => ({
            product_id: productId,
            size: s.size,
            stock: parseInt(s.stock) || 0,
            sort_order: s.sortOrder ?? idx,
          }))
        );
      }
    }

    // Update colors (replace all)
    if (body.colors !== undefined) {
      await admin.from("product_colors").delete().eq("product_id", productId);
      if (body.colors.length > 0) {
        await admin.from("product_colors").insert(
          body.colors.map((c: any) => ({
            product_id: productId,
            name: c.name,
            hex_value: c.hexValue,
            stock: parseInt(c.stock) || 0,
          }))
        );
      }
    }

    // Update images (replace all) — THIS WAS MISSING!
    if (body.images !== undefined) {
      await admin.from("product_images").delete().eq("product_id", productId);
      if (body.images.length > 0) {
        const imagesToInsert = body.images
          .filter((img: any) => img.url) // Only insert images with a URL
          .map((img: any, idx: number) => ({
            product_id: productId,
            url: img.url,
            alt_text: img.altText || body.name || "Product image",
            is_primary: img.isPrimary || idx === 0,
            position: idx,
          }));
        if (imagesToInsert.length > 0) {
          await admin.from("product_images").insert(imagesToInsert);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
