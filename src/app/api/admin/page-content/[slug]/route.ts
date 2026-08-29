import { NextRequest, NextResponse } from "next/server";
import { getPageContent } from "@/lib/services/page-content";
import { PAGE_SLUGS, type PageSlug } from "@/lib/page-content-config";

/**
 * GET /api/admin/page-content/[slug]
 * Fetches the full content for a single page (for editing in admin).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!PAGE_SLUGS.includes(slug as PageSlug)) {
      return NextResponse.json({ success: false, error: "Invalid page slug" }, { status: 400 });
    }

    const content = await getPageContent(slug as PageSlug);
    return NextResponse.json({ success: true, content });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
