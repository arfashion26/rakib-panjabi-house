"use server";

import { createAdminClient } from "@/lib/supabase";
import type { PageContent, PageSlug } from "@/lib/page-content-config";

/**
 * Fetch page content for a given page slug.
 *
 * Content is stored in the `page_contents` table. If a row doesn't
 * exist for a slug (or the DB is unreachable), returns null — the
 * page will use its built-in default content.
 *
 * Uses admin client to bypass RLS — page content is public.
 */
export async function getPageContent(slug: PageSlug): Promise<PageContent | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      heroTitle: data.hero_title || "",
      heroSubtitle: data.hero_subtitle || "",
      heroDescription: data.hero_description || "",
      heroEyebrow: data.hero_eyebrow || "",
      bodyContent: data.body_content || "",
      metaTitle: data.meta_title || "",
      metaDescription: data.meta_description || "",
    };
  } catch {
    return null;
  }
}

/**
 * Fetch all page contents (for admin listing).
 */
export async function getAllPageContents(): Promise<
  Array<{
    slug: string;
    hero_title: string | null;
    hero_subtitle: string | null;
    updated_at: string;
  }>
> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select("slug, hero_title, hero_subtitle, updated_at")
      .order("slug", { ascending: true });

    if (error || !data) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

/**
 * Update page content (admin only).
 * Upserts the row — if it doesn't exist, inserts; if it does, updates.
 */
export async function updatePageContent(
  slug: PageSlug,
  content: PageContent
): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const now = new Date().toISOString();

    const { error } = await admin.from("page_contents").upsert(
      {
        slug,
        hero_title: content.heroTitle || null,
        hero_subtitle: content.heroSubtitle || null,
        hero_description: content.heroDescription || null,
        hero_eyebrow: content.heroEyebrow || null,
        body_content: content.bodyContent || null,
        meta_title: content.metaTitle || null,
        meta_description: content.metaDescription || null,
        updated_at: now,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error("updatePageContent error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("updatePageContent error:", e);
    return false;
  }
}
