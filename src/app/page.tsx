import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroBanner } from "@/components/home/hero-banner";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { NewArrivals, TrendingProducts } from "@/components/home/product-sections";
import { FlashSale } from "@/components/home/flash-sale";
import { PremiumCollectionCTA } from "@/components/home/premium-collection-cta";
import { BrandStory } from "@/components/home/brand-story";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { BlogPosts } from "@/components/home/blog-posts";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* New Arrivals */}
        <NewArrivals />

        {/* Flash Sale (with countdown) */}
        <FlashSale />

        {/* Trending Products */}
        <TrendingProducts />

        {/* Premium Collection CTA */}
        <PremiumCollectionCTA />

        {/* Brand Story */}
        <BrandStory />

        {/* Customer Reviews */}
        <CustomerReviews />

        {/* Instagram Feed */}
        <InstagramFeed />

        {/* Blog Posts */}
        <BlogPosts />
      </main>

      <SiteFooter />
    </div>
  );
}
