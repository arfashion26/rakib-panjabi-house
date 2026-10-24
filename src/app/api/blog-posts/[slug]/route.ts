import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/blog-posts/[slug]
 * Public endpoint — returns a single PUBLISHED blog post by slug.
 *
 * Used by /blog/[slug] page to render the article and (optionally)
 * by the layout's generateMetadata() to set the SEO <title>/<meta>.
 *
 * Cache: 1 hour at CDN + 5 min stale-while-revalidate.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "PUBLISHED")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, post: data },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
