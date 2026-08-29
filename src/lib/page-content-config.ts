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

export const PAGE_INFO: Record<PageSlug, { title: string; description: string }> = {
  about: {
    title: "About Us",
    description: "Company story, mission, vision, and values",
  },
  contact: {
    title: "Contact",
    description: "Contact information and contact form",
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked questions",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How customer data is collected and used",
  },
  terms: {
    title: "Terms & Conditions",
    description: "Terms of service and usage",
  },
  "return-policy": {
    title: "Return & Refund Policy",
    description: "Return process and refund policy",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    description: "Delivery times and shipping charges",
  },
  "size-guide": {
    title: "Size Guide",
    description: "Measurement guide for clothing",
  },
  lookbook: {
    title: "Lookbook",
    description: "Curated style looks",
  },
  "gift-cards": {
    title: "Gift Cards",
    description: "Gift card purchase page",
  },
  blog: {
    title: "Blog",
    description: "Blog posts listing",
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "Top-selling products",
  },
  "new-arrivals": {
    title: "New Arrivals",
    description: "Latest products",
  },
  sale: {
    title: "Sale",
    description: "Discounted products",
  },
};
