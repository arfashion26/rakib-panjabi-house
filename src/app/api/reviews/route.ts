import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * POST /api/reviews
 * Public endpoint — any customer can submit a review.
 * Reviews are created with status = 'PENDING' and only show on
 * the product page after admin approval.
 *
 * Body: { productId, name, phone, rating, title, content }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, name, phone, rating, title, content } = body;

    if (!productId || !name || !rating) {
      return NextResponse.json(
        { success: false, error: "Product ID, name, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Find or create user by phone (for userId field)
    let userId: string | null = null;
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      let normalizedPhone = cleanPhone;
      if (cleanPhone.startsWith("01")) {
        normalizedPhone = "88" + cleanPhone;
      }
      const userEmail = `${normalizedPhone}@alrakib.com`;

      const { data: existingProfile } = await admin
        .from("profiles")
        .select("id")
        .eq("email", userEmail)
        .maybeSingle();

      if (existingProfile) {
        userId = existingProfile.id;
      }
    }

    // Insert review with PENDING status
    const { data, error } = await admin.from("reviews").insert({
      product_id: productId,
      user_id: userId,
      rating: Number(rating),
      title: title || null,
      content: content || null,
      status: "PENDING",
      is_verified: false,
    }).select().single();

    if (error) {
      console.error("Review insert error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to submit review: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted! It will appear after admin approval.",
      reviewId: data.id,
    });
  } catch (e: any) {
    console.error("Review submission error:", e);
    return NextResponse.json(
      { success: false, error: e.message || "Server error" },
      { status: 500 }
    );
  }
}
