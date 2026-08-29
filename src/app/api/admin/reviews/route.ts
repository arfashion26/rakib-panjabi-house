import { NextRequest, NextResponse } from "next/server";
import {
  getAllHomepageReviews,
  createHomepageReview,
} from "@/lib/services/homepage-reviews";

/**
 * GET /api/admin/reviews
 * List all homepage reviews (admin only).
 */
export async function GET() {
  try {
    const reviews = await getAllHomepageReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/reviews
 * Create a new homepage review.
 * Body: { customer_name, customer_location, product_name, rating, review_text, is_active, sort_order }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_location,
      product_name,
      rating,
      review_text,
      is_active,
      sort_order,
    } = body;

    if (!customer_name || !review_text || !rating) {
      return NextResponse.json(
        { success: false, error: "Customer name, review text, and rating are required" },
        { status: 400 }
      );
    }

    const result = await createHomepageReview({
      customer_name: customer_name.trim(),
      customer_location: (customer_location || "").trim(),
      product_name: (product_name || "").trim(),
      rating: Number(rating),
      review_text: review_text.trim(),
      is_active: is_active !== false,
      sort_order: Number(sort_order) || 0,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
