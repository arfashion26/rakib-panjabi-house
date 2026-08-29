/**
 * Page content configuration — constants only.
 *
 * This file has NO "use server" directive so it can be imported by both
 * server and client code.
 */

export interface PageContent {
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  // Optional hero eyebrow (small label above title)
  heroEyebrow?: string;
  // Body content (for policy pages — multi-paragraph)
  bodyContent?: string;
  // SEO
  metaTitle?: string;
  metaDescription?: string;
}

export const PAGE_SLUGS = [
  "about",
  "contact",
  "faq",
  "privacy-policy",
  "terms",
  "return-policy",
  "shipping-policy",
  "size-guide",
  "lookbook",
  "gift-cards",
  "blog",
  "best-sellers",
  "new-arrivals",
  "sale",
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];

export interface PageInfo {
  title: string;
  description: string;
  // Default SEO metadata (shown when admin hasn't set custom values)
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

export const PAGE_INFO: Record<PageSlug, PageInfo> = {
  about: {
    title: "About Us",
    description: "Company story, mission, vision, and values",
    defaultMetaTitle: "About Us | Rakib Panjabi House — Premium Fashion Brand",
    defaultMetaDescription:
      "Discover the story behind Rakib Panjabi House — a premium fashion brand committed to quality, craftsmanship, and timeless elegance. Founded in Dhaka, serving customers across Bangladesh.",
  },
  contact: {
    title: "Contact",
    description: "Contact information and contact form",
    defaultMetaTitle: "Contact Us | Rakib Panjabi House — Get in Touch",
    defaultMetaDescription:
      "Contact Rakib Panjabi House for any questions about products, orders, or inquiries. Email: info@alrakib.com, Phone: +880 1716-243949. Shop no-78, Mukjoddha Super Market, Mirpur-1, Dhaka.",
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked questions",
    defaultMetaTitle: "FAQ | Rakib Panjabi House — Frequently Asked Questions",
    defaultMetaDescription:
      "Find answers to common questions about orders, shipping, returns, payments, and products. Cash on Delivery available across Bangladesh. 7-day return policy.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How customer data is collected and used",
    defaultMetaTitle: "Privacy Policy | Rakib Panjabi House",
    defaultMetaDescription:
      "Read our privacy policy to understand how Rakib Panjabi House collects, uses, and protects your personal information. Your privacy is our priority.",
  },
  terms: {
    title: "Terms & Conditions",
    description: "Terms of service and usage",
    defaultMetaTitle: "Terms & Conditions | Rakib Panjabi House",
    defaultMetaDescription:
      "Review the terms and conditions for using Rakib Panjabi House website and services. By accessing our website, you agree to these terms.",
  },
  "return-policy": {
    title: "Return & Refund Policy",
    description: "Return process and refund policy",
    defaultMetaTitle: "Return & Refund Policy | Rakib Panjabi House",
    defaultMetaDescription:
      "Learn about our 7-day return policy. If you're not satisfied with your purchase, return it within 7 days for a full refund or exchange. Items must be unworn and with original tags.",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "Delivery times and shipping charges",
    defaultMetaTitle: "Shipping Policy | Rakib Panjabi House — Delivery Information",
    defaultMetaDescription:
      "Delivery in 1 day inside Dhaka, 1-3 days outside Dhaka. Cash on Delivery available across Bangladesh. Free shipping on orders over ৳2000. COD charges: ৳70 (Dhaka), ৳120 (outside).",
  },
  "size-guide": {
    title: "Size Guide",
    description: "Measurement guide for clothing",
    defaultMetaTitle: "Size Guide | Rakib Panjabi House — Find Your Perfect Fit",
    defaultMetaDescription:
      "Use our comprehensive size guide to find your perfect fit for panjabis, shirts, pants, and ethnic wear. Measurements in inches for accurate sizing.",
  },
  lookbook: {
    title: "Lookbook",
    description: "Curated style looks",
    defaultMetaTitle: "Lookbook 2026 | Rakib Panjabi House — Premium Style Inspiration",
    defaultMetaDescription:
      "Explore our curated looks for the modern gentleman — premium ethnic wear styled for every occasion. Get inspired by the latest fashion trends from Rakib Panjabi House.",
  },
  "gift-cards": {
    title: "Gift Cards",
    description: "Gift card purchase page",
    defaultMetaTitle: "Gift Cards | Rakib Panjabi House — Perfect Gift for Loved Ones",
    defaultMetaDescription:
      "Give the perfect gift with Rakib Panjabi House gift cards. Available in ৳500 to ৳10,000 denominations. Delivered via email, valid for 12 months. Never expires.",
  },
  blog: {
    title: "Blog",
    description: "Blog posts listing",
    defaultMetaTitle: "Blog | Rakib Panjabi House — Fashion Tips & Style Guide",
    defaultMetaDescription:
      "Read our blog for style tips, fashion insights, and stories from the world of premium menswear. Learn how to style panjabis, sherwanis, and ethnic wear.",
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "Top-selling products",
    defaultMetaTitle: "Best Sellers | Rakib Panjabi House — Most Popular Products",
    defaultMetaDescription:
      "Shop our best-selling panjabis, shirts, and ethnic wear — chosen by thousands of happy customers. Premium quality at affordable prices. Cash on Delivery available.",
  },
  "new-arrivals": {
    title: "New Arrivals",
    description: "Latest products",
    defaultMetaTitle: "New Arrivals | Rakib Panjabi House — Latest Fashion Collection",
    defaultMetaDescription:
      "Discover the latest additions to our collection — fresh designs and seasonal must-haves in premium panjabis, shirts, and ethnic wear. Shop new arrivals today.",
  },
  sale: {
    title: "Sale",
    description: "Discounted products",
    defaultMetaTitle: "Sale | Rakib Panjabi House — Up to 40% Off Premium Fashion",
    defaultMetaDescription:
      "Save big on premium fashion. Up to 40% off on selected panjabis, shirts, and ethnic wear. Limited stock available — grab your favorites before they're gone!",
  },
};
