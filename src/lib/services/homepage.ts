"use server";

import { createAdminClient } from "@/lib/supabase";

const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "New Autumn Collection 2026",
    title: "Timeless Elegance,",
    titleAccent: "Modern Refinement",
    description: "Discover the finest collection of premium Panjabis, shirts, and ethnic wear crafted with superior fabrics and impeccable attention to detail. Each piece tells a story of tradition meeting contemporary style.",
    primaryCtaText: "Explore Collection",
    primaryCtaLink: "/shop",
    secondaryCtaText: "New Arrivals",
    secondaryCtaLink: "/new-arrivals",
    stat1Value: "10K+",
    stat1Label: "Happy Customers",
    stat2Value: "500+",
    stat2Label: "Premium Products",
    stat3Value: "4.9",
    stat3Label: "Customer Rating",
  },
  premiumCta: {
    eyebrow: "Exclusive Edition",
    title: "Discover Our Premium Collection",
    description: "Handpicked pieces crafted with the finest materials and utmost care. Each item in our premium collection represents the pinnacle of Bangladeshi craftsmanship and contemporary design.",
    primaryCtaText: "Explore Collection",
    primaryCtaLink: "/shop",
    secondaryCtaText: "View Lookbook",
    secondaryCtaLink: "/lookbook",
  },
  brandStory: {
    eyebrow: "Our Story",
    title: "A Legacy of Craftsmanship",
    description: "Rakib Panjabi House was founded with a singular vision — to bring premium quality ethnic and contemporary fashion to the modern Bangladeshi gentleman.",
    description2: "From our humble beginnings in Dhaka, we have grown into a trusted destination for discerning customers who appreciate the finer details. Each piece in our collection is a testament to our commitment to quality, from the carefully sourced fabrics to the final stitches applied by our skilled artisans.",
    description3: "Today, Rakib Panjabi House serves thousands of customers across Bangladesh and beyond. But our mission remains the same: to create clothing that makes you feel confident, comfortable, and connected to your cultural heritage.",
  },
  reviewsSection: {
    eyebrow: "Loved by Thousands",
    title: "What Our Customers Say",
    subtitle: "Real reviews from real customers who have experienced the Rakib Panjabi House difference.",
  },
  announcement: {
    text: "✦ Free shipping on orders over ৳2000 — Shop the New Collection Today ✦",
    enabled: true,
  },
  newsletter: {
    title: "Join Our Exclusive Circle",
    description: "Subscribe to receive early access to new collections, private sales, and style inspiration straight to your inbox.",
  },
};

export async function getHomepageContent() {
  try {
    const admin = createAdminClient();
    const { data: setting } = await admin
      .from("settings")
      .select("value")
      .eq("key", "homepage_content")
      .single();

    if (setting?.value) {
      const saved = JSON.parse(setting.value);
      return { ...DEFAULT_CONTENT, ...saved };
    }
    return DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}
