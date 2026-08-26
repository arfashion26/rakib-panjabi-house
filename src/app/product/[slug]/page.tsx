import { getProductBySlug } from "@/lib/services/products";
import { ProductDetailContent } from "@/components/product/product-detail-content";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, images, reviews, relatedProducts } = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailContent
      product={product}
      images={images}
      reviews={reviews}
      relatedProducts={relatedProducts}
    />
  );
}
