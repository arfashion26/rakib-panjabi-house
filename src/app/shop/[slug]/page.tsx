import { getProducts, getCategoryBySlug } from "@/lib/services/products";
import { CategoryContent } from "@/components/shop/category-content";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { products, total } = await getProducts({
    categorySlug: slug,
    limit: 100,
  });

  return <CategoryContent category={category} products={products} total={total} />;
}
