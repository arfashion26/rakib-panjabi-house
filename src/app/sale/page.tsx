import type { Metadata } from "next";
import { getProducts } from "@/lib/services/products";
import { ProductGridPage } from "@/components/product/product-grid-page";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("sale");
}


// ISR — revalidate every 1 hour. Once cached, users get instant load.
export const revalidate = 3600;

export default async function SalePage() {
  const { products } = await getProducts({ isFlashSale: true, sortBy: "newest", limit: 100 });
  return (
    <ProductGridPage
      title="Sale — Up to 40% Off"
      eyebrow="Limited Time"
      description="Save big on premium fashion. Limited stock available — grab your favorites before they're gone!"
      products={products}
      saleMode
    />
  );
}
