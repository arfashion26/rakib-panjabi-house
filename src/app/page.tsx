import { getProducts } from "@/lib/services/products";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { TrendingProducts } from "@/components/home/product-sections";
import { FlashSale } from "@/components/home/flash-sale";
import { PremiumCollectionCTA } from "@/components/home/premium-collection-cta";
import { BrandStory } from "@/components/home/brand-story";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { BlogPosts } from "@/components/home/blog-posts";

export default async function Home() {
  // Fetch trending products (best sellers) on the server
  const { products: trending } = await getProducts({ isBestSeller: true, sortBy: "popular", limit: 4 });

  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <NewArrivals />
      <FlashSale />
      <TrendingProducts products={trending} />
      <PremiumCollectionCTA />
      <BrandStory />
      <CustomerReviews />
      <InstagramFeed />
      <BlogPosts />
    </>
  );
}
