import { getCategories } from "@/lib/services/products";
import { FeaturedCategoriesClient } from "./featured-categories-client";

export async function FeaturedCategories() {
  let featured: { id: string; name: string; slug: string; description: string | null; image: string | null }[] = [];

  try {
    const cats = await getCategories();
    featured = cats.filter((c) => c.is_featured).slice(0, 4);
  } catch {
    // Fallback to empty if DB not available
  }

  if (featured.length === 0) return null;

  return <FeaturedCategoriesClient featured={featured} />;
}
