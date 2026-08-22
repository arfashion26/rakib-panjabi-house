import { getProducts, getCategories } from "@/lib/services/products";
import { ShopContent } from "@/components/shop/shop-content";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const params = await searchParams;
  const sortBy = (params.sort as "newest" | "price_asc" | "price_desc" | "popular" | "rating") || "newest";

  const { products, total } = await getProducts({
    search: params.q,
    categorySlug: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sortBy,
    limit: 100,
  });

  const categories = await getCategories();

  return (
    <ShopContent
      products={products}
      categories={categories}
      total={total}
      searchParams={params}
    />
  );
}
