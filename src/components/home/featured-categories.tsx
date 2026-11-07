import { getHomepageOrderedCategories } from "@/lib/services/products";
import { FeaturedCategoriesClient } from "./featured-categories-client";

export async function FeaturedCategories() {
  let featured: { id: string; name: string; slug: string; description: string | null; image: string | null }[] = [];

  try {
    // Fetch categories pre-sorted by the admin-configured homepage display
    // order (falls back to DB-side sort if no order is configured).
    const sorted = await getHomepageOrderedCategories();

    // Featured categories (is_featured=true), top 4, after sorting
    featured = sorted
      .filter((c) => c.is_featured)
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
      }));
  } catch {
    // Fallback to empty if DB not available
  }

  if (featured.length === 0) return null;

  return <FeaturedCategoriesClient featured={featured} />;
}
