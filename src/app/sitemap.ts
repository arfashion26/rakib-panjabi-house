import type { MetadataRoute } from "next";
import { siteConfig, categories } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
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
    { url: `${baseUrl}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // Policy pages
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/return-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // In production, also include product pages from database
  // For now, include placeholder product slugs
  const placeholderProductSlugs = [
    "premium-cotton-panjabi-emerald",
    "royal-silk-sherwani-ivory-gold",
    "linen-casual-shirt-sand",
    "tailored-wool-blazer-charcoal",
    "premium-oxford-shirt-white",
    "embroidered-kurta-pajama-maroon",
    "slim-fit-jeans-dark-indigo",
    "quilted-winter-jacket-olive",
    "cotton-polo-shirt-navy",
    "premium-t-shirt-heather-grey",
    "formal-trousers-black",
    "premium-leather-belt-brown",
  ];
  const productPages: MetadataRoute.Sitemap = placeholderProductSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog post pages
  const blogPostSlugs = [
    "art-of-choosing-perfect-panjabi",
    "styling-sherwani-wedding",
    "caring-premium-ethnic-wear",
    "winter-fashion-trends-2026",
    "history-of-panjabi",
    "accessorize-ethnic-look",
  ];
  const blogPages: MetadataRoute.Sitemap = blogPostSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
