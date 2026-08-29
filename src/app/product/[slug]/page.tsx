import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/services/products";
import { ProductDetailContent } from "@/components/product/product-detail-content";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/brand";

/**
 * Dynamic SEO metadata for each product.
 *
 * Priority:
 * 1. Admin-set meta_title / meta_description (from product edit form)
 * 2. Auto-generated from product name + short_description
 *
 * This ensures every product page has unique, SEO-friendly metadata
 * that search engines can index.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  // Use admin-set meta_title, or fall back to product name
  const title = (product as any).meta_title || `${product.name} | ${siteConfig.name}`;

  // Use admin-set meta_description, or fall back to short_description / description
  const description =
    (product as any).meta_description ||
    product.short_description ||
    (product.description || "").slice(0, 160);

  // Open Graph image: first product image
  const ogImage = product.images?.[0]?.url || `${siteConfig.url}/og-image.jpg`;

  const url = `${siteConfig.url}/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

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
