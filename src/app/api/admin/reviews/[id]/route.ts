import { NextRequest, NextResponse } from "next/server";
import { updateHomepageReview, deleteHomepageReview } from "@/lib/services/homepage-reviews";

/**
 * PATCH /api/admin/reviews/[id]
 * Update a homepage review (e.g. toggle active, edit text).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const result = await updateHomepageReview(id, {
      customer_name: body.customer_name,
      customer_location: body.customer_location,
      product_name: body.product_name,
      rating: body.rating !== undefined ? Number(body.rating) : undefined,
      review_text: body.review_text,
      is_active: body.is_active,
      sort_order: body.sort_order !== undefined ? Number(body.sort_order) : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Delete a homepage review permanently.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteHomepageReview(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to delete review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
