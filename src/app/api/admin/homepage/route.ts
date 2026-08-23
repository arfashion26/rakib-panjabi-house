import { NextRequest, NextResponse } from "next/server";
import { createServerClientHelper, createAdminClient } from "@/lib/supabase";

// Default homepage content
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
    primaryCtaLink: "/shop/premium-collection",
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

async function verifyAdmin() {
  const supabase = await createServerClientHelper();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "ACTIVE") return null;
  if (!["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(profile.role)) return null;
  return profile;
}

/**
 * GET /api/admin/homepage
 * Fetch homepage content from settings table
 */
export async function GET() {
  try {
    const admin = createAdminClient();

    // Try to fetch from settings table
    const { data: setting } = await admin
      .from("settings")
      .select("value")
      .eq("key", "homepage_content")
      .single();

    if (setting?.value) {
      const content = JSON.parse(setting.value);
      return NextResponse.json({ success: true, content: { ...DEFAULT_CONTENT, ...content } });
    }

    // No saved content — return defaults
    return NextResponse.json({ success: true, content: DEFAULT_CONTENT });
  } catch (error: any) {
    return NextResponse.json({ success: true, content: DEFAULT_CONTENT });
  }
}

/**
 * PUT /api/admin/homepage
 * Save homepage content to settings table
 */
export async function PUT(request: NextRequest) {
  try {
    const profile = await verifyAdmin();
    if (!profile) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const contentString = JSON.stringify(body);

    const admin = createAdminClient();

    // Upsert into settings table
    const { error } = await admin
      .from("settings")
      .upsert(
        {
          key: "homepage_content",
          value: contentString,
          type: "json",
          description: "Homepage content (hero, brand story, CTA, reviews, etc.)",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Homepage content saved" });
  } catch (error: any) {
    console.error("Homepage save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
