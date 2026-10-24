import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/blog-posts
 * Public endpoint — returns all PUBLISHED blog posts.
 *
 * IMPORTANT: This endpoint MUST stay fresh — admin blog edits (create /
 * update / delete) need to be reflected immediately on the homepage blog
 * section and the /blog archive page. If we cache this for an hour, deleted
 * posts keep showing up on the listing pages even though /blog/[slug]
 * correctly returns 404.
 *
 * Cache strategy:
 *   - force-dynamic: never cached by Next.js server-side
 *   - Cache-Control: no-store (browser fetch also stays fresh)
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .eq("status", "PUBLISHED")
      .order("published_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, posts: data || [] },
      {
        headers: {
          // Browser / CDN must always revalidate — never serve stale list
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
