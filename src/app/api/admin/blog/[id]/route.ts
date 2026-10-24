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

/** Revalidate blog-related paths so updates show up immediately. */
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
 * PATCH /api/admin/blog/[id]
 * Update a blog post (e.g. toggle status, edit content).
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const admin = createAdminClient();

    // Look up current slug BEFORE updating, so we can revalidate the old URL too.
    // (If the slug changes, we need to purge both the old and the new path.)
    let previousSlug: string | undefined;
    if (body.slug !== undefined) {
      const { data: existing } = await admin
        .from("blog_posts")
        .select("slug")
        .eq("id", id)
        .maybeSingle();
      previousSlug = existing?.slug;
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image;
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title || null;
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description || null;
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.is_featured !== undefined) updateData.is_featured = !!body.is_featured;
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "PUBLISHED") {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { error } = await admin.from("blog_posts").update(updateData).eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Purge cache for both the old slug (in case slug changed) and the new slug
    revalidateBlogPaths(previousSlug);
    if (body.slug && body.slug !== previousSlug) {
      revalidateBlogPaths(body.slug);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/blog/[id]
 * Delete a blog post permanently.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminProfile = await verifyAdmin();
    if (!adminProfile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const admin = createAdminClient();

    // Look up slug before deletion so we can purge that path from the cache
    const { data: existing } = await admin
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .maybeSingle();
    const deletedSlug = existing?.slug;

    // Delete comments first (if any)
    await admin.from("blog_comments").delete().eq("post_id", id);

    const { error } = await admin.from("blog_posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidateBlogPaths(deletedSlug);

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
