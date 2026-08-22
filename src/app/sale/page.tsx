import { getProducts } from "@/lib/services/products";
import { ProductGridPage } from "@/components/product/product-grid-page";

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
