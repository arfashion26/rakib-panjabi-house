import type { Metadata } from "next";
import { getProducts } from "@/lib/services/products";
import { ProductGridPage } from "@/components/product/product-grid-page";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("best-sellers");
}

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
