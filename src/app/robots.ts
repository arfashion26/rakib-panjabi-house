import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/dashboard",
        "/dashboard/*",
        "/api",
        "/api/*",
        "/checkout",
        "/thank-you",
        "/order-success",
        "/cart",
        "/wishlist",
        "/compare",
        "/track-order",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
