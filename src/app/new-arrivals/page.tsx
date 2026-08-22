import { getProducts } from "@/lib/services/products";
import { ProductGridPage } from "@/components/product/product-grid-page";

export default async function NewArrivalsPage() {
  const { products } = await getProducts({ isNewArrival: true, sortBy: "newest", limit: 100 });
  return (
    <ProductGridPage
      title="New Arrivals"
      eyebrow="Just Arrived"
      description="Discover the latest additions to our collection. Fresh designs, premium fabrics, and the season's must-have pieces."
      products={products}
    />
  );
}
