import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();
  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(profile.role)) return null;
  return profile;
}

/** Revalidate blog-related paths so the new/updated post shows up immediately. */
function revalidateBlogPaths(slug?: string) {
  try {
    revalidatePath("/blog");
    revalidatePath("/blog", "layout");
    if (slug) {
      revalidatePath(`/blog/${slug}`);
      revalidatePath(`/blog/${slug}`, "page");
    }
  } catch {
    // Non-fatal — ISR will catch up on the next periodic refresh
  }
}

/**
 * GET /api/admin/blog
 * List all blog posts.
 */
export async function GET() {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Table might not exist — return empty
      return NextResponse.json({ success: true, posts: [] });
    }

    return NextResponse.json({ success: true, posts: data || [] });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/blog
 * Create a new blog post.
 */
export async function POST(req: NextRequest) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      cover_image,
      status,
      meta_title,
      meta_description,
      tags,
      is_featured,
    } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data, error } = await admin
      .from("blog_posts")
      .insert({
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content: content || null,
        category: category || "General",
        cover_image: cover_image || null,
        status: status || "DRAFT",
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        tags: Array.isArray(tags) ? tags : [],
        is_featured: typeof is_featured === "boolean" ? is_featured : false,
        author_id: null, // will be set by RLS or trigger
        published_at: status === "PUBLISHED" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Purge cache so the new post is immediately visible
    revalidateBlogPaths(finalSlug);

    return NextResponse.json({ success: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
