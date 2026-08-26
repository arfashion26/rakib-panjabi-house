import { getProducts } from "@/lib/services/products";
import { ProductGridPage } from "@/components/product/product-grid-page";

export default async function BestSellersPage() {
  const { products } = await getProducts({ isBestSeller: true, sortBy: "popular", limit: 100 });
  return (
    <ProductGridPage
      title="Best Sellers"
      eyebrow="Customer Favorites"
      description="Our most-loved pieces, chosen by thousands of happy customers. Shop the styles everyone is talking about."
      products={products}
    />
  );
}
