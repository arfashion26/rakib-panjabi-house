import { getProducts } from "@/lib/services/products";
import { NewArrivalsContent } from "@/components/home/new-arrivals-content";

export async function NewArrivals() {
  const { products } = await getProducts({ isNewArrival: true, sortBy: "newest", limit: 8 });
  return <NewArrivalsContent products={products} />;
}
