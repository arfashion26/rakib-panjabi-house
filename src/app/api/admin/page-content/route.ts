import { NextRequest, NextResponse } from "next/server";
import { getAllPageContents, updatePageContent } from "@/lib/services/page-content";
import { PAGE_SLUGS, type PageSlug } from "@/lib/page-content-config";

/**
 * GET /api/admin/page-content
 * Lists all pages and their edit status.
 */
export async function GET() {
  try {
    const contents = await getAllPageContents();
    const contentMap = new Map(contents.map((c) => [c.slug, c]));

    // Return all known pages, with edit status
    const pages = PAGE_SLUGS.map((slug) => {
      const c = contentMap.get(slug);
      return {
        slug,
        isEdited: !!c,
        heroTitle: c?.hero_title || "",
        updatedAt: c?.updated_at || null,
      };
    });

    return NextResponse.json({ success: true, pages });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/page-content
 * Body: { slug, heroTitle, heroSubtitle, heroDescription, heroEyebrow, bodyContent, metaTitle, metaDescription }
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body as { slug: PageSlug };

    if (!slug || !PAGE_SLUGS.includes(slug)) {
      return NextResponse.json({ success: false, error: "Invalid page slug" }, { status: 400 });
    }

    const ok = await updatePageContent(slug, {
      heroTitle: body.heroTitle || "",
      heroSubtitle: body.heroSubtitle || "",
      heroDescription: body.heroDescription || "",
      heroEyebrow: body.heroEyebrow || "",
      bodyContent: body.bodyContent || "",
      metaTitle: body.metaTitle || "",
      metaDescription: body.metaDescription || "",
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Failed to update page content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
