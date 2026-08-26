import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/brand";
import { createAdminClient } from "@/lib/supabase";

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

  // Fetch real categories from database
  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const admin = createAdminClient();

    // Categories
    const { data: categories } = await admin
      .from("categories")
      .select("slug, updated_at")
      .eq("is_active", true);

    if (categories) {
      categoryPages = categories.map((cat) => ({
        url: `${baseUrl}/shop/${cat.slug}`,
        lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }

    // Products
    const { data: products } = await admin
      .from("products")
      .select("slug, updated_at")
      .eq("status", "ACTIVE");

    if (products) {
      productPages = products.map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }

    // Blog posts
    const { data: posts } = await admin
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("status", "PUBLISHED");

    if (posts) {
      blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    }
  } catch {
    // If DB not available, just return static pages
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
