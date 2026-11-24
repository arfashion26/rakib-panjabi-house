import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/brand";
import { createAdminClient } from "@/lib/supabase";

/**
 * Sitemap generator.
 *
 * Build-time fetches of categories / products / blog_posts run in
 * PARALLEL with a strict 8s per-query timeout. If Supabase is slow or
 * unreachable at build time (which has historically caused 60s+ build
 * hangs on the /sitemap.xml route -> build failures), the queries are
 * aborted and we fall back to just the static pages. The site still
 * builds; the dynamic sitemap entries simply regenerate on the next
 * successful build.
 */
const FETCH_TIMEOUT_MS = 8000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url; // https://alrakib.com
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/best-sellers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/sale`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lookbook`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/gift-cards`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/size-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/track-order`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // Policy pages
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/return-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Fetch dynamic pages in parallel, each with an 8s timeout. Any failure
  // (timeout, network error, missing env var) yields [] for that bucket
  // and the sitemap still builds with whatever succeeded.
  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const admin = createAdminClient();
    const signal = () => AbortSignal.timeout(FETCH_TIMEOUT_MS);

    const [categoriesRes, productsRes, postsRes] = await Promise.allSettled([
      admin.from("categories").select("slug, updated_at").eq("is_active", true).abortSignal(signal()),
      admin.from("products").select("slug, updated_at").eq("status", "ACTIVE").abortSignal(signal()),
      admin.from("blog_posts").select("slug, updated_at").eq("status", "PUBLISHED").abortSignal(signal()),
    ]);

    if (categoriesRes.status === "fulfilled") {
      const categories = categoriesRes.value.data;
      if (categories) {
        categoryPages = categories.map((cat) => ({
          url: `${baseUrl}/shop/${cat.slug}`,
          lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      }
    }

    if (productsRes.status === "fulfilled") {
      const products = productsRes.value.data;
      if (products) {
        productPages = products.map((p) => ({
          url: `${baseUrl}/product/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
      }
    }

    if (postsRes.status === "fulfilled") {
      const posts = postsRes.value.data;
      if (posts) {
        blogPages = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : now,
          changeFrequency: "monthly" as const,
          priority: 0.5,
        }));
      }
    }
  } catch {
    // If DB not available, just return static pages
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
