import { getProducts } from "@/lib/services/products";
import { FlashSaleContent } from "@/components/home/flash-sale-content";

export async function FlashSale() {
  const { products } = await getProducts({ isFlashSale: true, sortBy: "newest", limit: 4 });
  return <FlashSaleContent products={products} />;
}
