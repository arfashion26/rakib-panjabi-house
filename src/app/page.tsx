import { getHomepageContent } from "@/lib/services/homepage";
import { getProducts } from "@/lib/services/products";
import { HeroBannerContent } from "@/components/home/hero-banner-content";
import { TrustBadges } from "@/components/home/trust-badges";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals } from "@/components/home/new-arrivals";
import { TrendingProducts } from "@/components/home/product-sections";
import { FlashSale } from "@/components/home/flash-sale";
import { PremiumCTAContent } from "@/components/home/premium-collection-cta-content";
import { BrandStoryContent } from "@/components/home/brand-story-content";
import { CustomerReviewsContent } from "@/components/home/customer-reviews-content";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { BlogPosts } from "@/components/home/blog-posts";

// Revalidate homepage every 24 hours ( ISR — static + incremental )
// Once cached, users get instant load. Admin homepage edits still
// propagate within 24h, or instantly via /api/revalidate if needed.
export const revalidate = 86400;

// Static generation + dynamicParams disabled for full pre-render
export const dynamic = "force-static";

// Cache homepage for a long time at the CDN/edge level too
export const fetchCache = "force-cache";

export default async function Home() {
  // Parallel fetches — all run concurrently for faster TTFB
  const [content, trendingRes] = await Promise.all([
    getHomepageContent(),
    getProducts({ isBestSeller: true, sortBy: "popular", limit: 4 }),
  ]);
  const trending = trendingRes.products;

  return (
    <>
      <HeroBannerContent content={{ ...content.hero, heroSlides: content.heroSlides } as any} announcement={content.announcement} />
      <TrustBadges />
      <FeaturedCategories />
      <NewArrivals />
      <FlashSale />
      <TrendingProducts products={trending} />
      <PremiumCTAContent content={content.premiumCta} />
      <BrandStoryContent content={content.brandStory} />
      <CustomerReviewsContent content={content.reviewsSection} />
      <InstagramFeed content={content.instagram} />
      <BlogPosts />
    </>
  );
}
