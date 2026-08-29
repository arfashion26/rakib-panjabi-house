import type { Metadata } from "next";
import { siteConfig } from "@/lib/brand";
import { PAGE_INFO, type PageSlug } from "@/lib/page-content-config";

/**
 * Generate metadata for a static page using its slug.
 *
 * Uses the default meta title/description from PAGE_INFO, or the
 * admin-edited values if they exist (fetched at build/request time).
 *
 * Usage in a page:
 *   export async function generateMetadata() {
 *     return getPageMetadata("about");
 *   }
 */
export async function getPageMetadata(slug: PageSlug): Promise<Metadata> {
  const info = PAGE_INFO[slug];
  const url = `${siteConfig.url}/${slug}`;

  // Try to fetch admin-edited content (overrides defaults)
  let metaTitle = info.defaultMetaTitle;
  let metaDescription = info.defaultMetaDescription;

  try {
    // Dynamic import to avoid circular dependency in some cases
    const { getPageContent } = await import("@/lib/services/page-content");
    const content = await getPageContent(slug);
    if (content?.metaTitle) metaTitle = content.metaTitle;
    if (content?.metaDescription) metaDescription = content.metaDescription;
  } catch {
    // Fall back to defaults if DB is unreachable
  }

  return {
    // Use 'absolute' to prevent the root layout's title template from
    // appending "| Rakib Panjabi House" (our titles already include it)
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}
