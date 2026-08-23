import { getHomepageContent } from "@/lib/services/homepage";
import { getProducts } from "@/lib/services/products";
import { HeroBannerContent } from "@/components/home/hero-banner-content";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { TrendingProducts } from "@/components/home/product-sections";
import { FlashSale } from "@/components/home/flash-sale";
import { PremiumCTAContent } from "@/components/home/premium-collection-cta-content";
import { BrandStoryContent } from "@/components/home/brand-story-content";
import { CustomerReviewsContent } from "@/components/home/customer-reviews-content";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { BlogPosts } from "@/components/home/blog-posts";

export default async function Home() {
  const content = await getHomepageContent();
  const { products: trending } = await getProducts({ isBestSeller: true, sortBy: "popular", limit: 4 });

  return (
    <>
      <HeroBannerContent content={content.hero} announcement={content.announcement} />
      <FeaturedCategories />
      <NewArrivals />
      <FlashSale />
      <TrendingProducts products={trending} />
      <PremiumCTAContent content={content.premiumCta} />
      <BrandStoryContent content={content.brandStory} />
      <CustomerReviewsContent content={content.reviewsSection} />
      <InstagramFeed />
      <BlogPosts />
    </>
  );
}
