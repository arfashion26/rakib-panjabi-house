import { getHomepageContent } from "@/lib/services/homepage";
import { getProducts, getCategories } from "@/lib/services/products";
import { MegaHero } from "@/components/home/mega-hero";
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

// Revalidate homepage every hour (ISR — static + incremental).
// Admin homepage edits trigger on-demand revalidation via /api/revalidate,
// so changes appear immediately. This hourly revalidate is a fallback.
export const revalidate = 3600;

// Always render dynamically — ensures admin changes are visible immediately
// on the homepage without waiting for ISR cache expiry.
export const dynamic = "force-dynamic";

// Cache homepage at the CDN/edge level for fast repeat visits.
export const fetchCache = "force-cache";

export default async function Home() {
  // Parallel fetches — all run concurrently for faster TTFB
  const [content, trendingRes, categories] = await Promise.all([
    getHomepageContent(),
    getProducts({ isBestSeller: true, sortBy: "popular", limit: 4 }),
    getCategories(),
  ]);
  const trending = trendingRes.products;

  return (
    <>
      <MegaHero
        slides={content.heroSlides || []}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image,
        }))}
        announcement={content.announcement}
      />
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
