import { NextRequest, NextResponse } from "next/server";
import { getCustomCode, updateCustomCode } from "@/lib/services/custom-code";

/**
 * GET /api/admin/custom-code
 * Returns the current custom tracking code (admin only).
 */
export async function GET() {
  try {
    const code = await getCustomCode();
    return NextResponse.json({ success: true, code });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/custom-code
 * Body: { head, body_top, body_bottom }
 * Updates the custom tracking code (admin only).
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { head, body_top, body_bottom } = body;

    const ok = await updateCustomCode({
      head: head ?? "",
      body_top: body_top ?? "",
      body_bottom: body_bottom ?? "",
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Failed to update custom code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
