/**
 * Rakib Panjabi House - Brand Configuration
 * Central source of truth for brand identity, navigation, and categories
 */

export const siteConfig = {
  name: "Rakib Panjabi House",
  shortName: "Rakib",
  tagline: "Premium Panjabi & Fashion for the Modern Gentleman",
  description:
    "Premium quality Panjabis, shirts, pants, and ethnic wear with timeless elegance and modern designs. Free shipping across Bangladesh.",
  url: "https://rakib-panjabi-house.vercel.app",
  ogImage: "/og-image.jpg",
  email: "support@rakibpanjabihouse.com",
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "+880 1XXX-XXXXXX",
  address: "Dhaka, Bangladesh",
  social: {
    facebook: "https://facebook.com/rakibpanjabihouse",
    instagram: "https://instagram.com/rakibpanjabihouse",
    youtube: "https://youtube.com/@rakibpanjabihouse",
    tiktok: "",
    twitter: "",
  },
  currency: {
    default: "BDT",
    symbol: "৳",
    rates: {
      BDT: 1,
      USD: 0.0091,
      EUR: 0.0084,
    },
  },
  languages: ["en", "bn"],
};

/**
 * Product categories with proper hierarchy
 */
export const categories = [
  {
    name: "Panjabi Collection",
    slug: "panjabi-collection",
    href: "/shop/panjabi-collection",
    description: "Premium panjabis crafted with the finest fabrics",
    image: "/categories/panjabi.jpg",
    featured: true,
    subcategories: [
      { name: "Premium Panjabi", slug: "premium-panjabi" },
      { name: "Cotton Panjabi", slug: "cotton-panjabi" },
      { name: "Silk Panjabi", slug: "silk-panjabi" },
      { name: "Kurta Panjabi", slug: "kurta-panjabi" },
    ],
  },
  {
    name: "Shirts",
    slug: "shirts",
    href: "/shop/shirts",
    description: "Formal and casual shirts for every occasion",
    image: "/categories/shirts.jpg",
    featured: true,
    subcategories: [
      { name: "Formal Shirts", slug: "formal-shirts" },
      { name: "Casual Shirts", slug: "casual-shirts" },
      { name: "Linen Shirts", slug: "linen-shirts" },
      { name: "Oxford Shirts", slug: "oxford-shirts" },
    ],
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    href: "/shop/t-shirts",
    description: "Comfortable and stylish t-shirts",
    image: "/categories/tshirts.jpg",
    featured: false,
  },
  {
    name: "Polo Shirts",
    slug: "polo-shirts",
    href: "/shop/polo-shirts",
    description: "Classic polo shirts for a refined look",
    image: "/categories/polo.jpg",
    featured: false,
  },
  {
    name: "Jeans",
    slug: "jeans",
    href: "/shop/jeans",
    description: "Premium denim in various fits and washes",
    image: "/categories/jeans.jpg",
    featured: false,
  },
  {
    name: "Pants",
    slug: "pants",
    href: "/shop/pants",
    description: "Formal and casual pants",
    image: "/categories/pants.jpg",
    featured: false,
  },
  {
    name: "Trousers",
    slug: "trousers",
    href: "/shop/trousers",
    description: "Refined trousers for the modern man",
    image: "/categories/trousers.jpg",
    featured: false,
  },
  {
    name: "Blazers",
    slug: "blazers",
    href: "/shop/blazers",
    description: "Elegant blazers for formal occasions",
    image: "/categories/blazers.jpg",
    featured: true,
  },
  {
    name: "Waistcoats",
    slug: "waistcoats",
    href: "/shop/waistcoats",
    description: "Stylish waistcoats to complete your look",
    image: "/categories/waistcoats.jpg",
    featured: false,
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    href: "/shop/hoodies",
    description: "Comfortable hoodies for casual wear",
    image: "/categories/hoodies.jpg",
    featured: false,
  },
  {
    name: "Jackets",
    slug: "jackets",
    href: "/shop/jackets",
    description: "Premium jackets for all seasons",
    image: "/categories/jackets.jpg",
    featured: false,
  },
  {
    name: "Punjabi Pajama",
    slug: "punjabi-pajama",
    href: "/shop/punjabi-pajama",
    description: "Traditional pajamas to pair with your panjabi",
    image: "/categories/pajama.jpg",
    featured: false,
  },
  {
    name: "Sherwani",
    slug: "sherwani",
    href: "/shop/sherwani",
    description: "Royal sherwanis for weddings and special occasions",
    image: "/categories/sherwani.jpg",
    featured: true,
  },
  {
    name: "Kids Collection",
    slug: "kids-collection",
    href: "/shop/kids-collection",
    description: "Stylish clothing for the little ones",
    image: "/categories/kids.jpg",
    featured: false,
  },
  {
    name: "Women Collection",
    slug: "women-collection",
    href: "/shop/women-collection",
    description: "Elegant fashion for women",
    image: "/categories/women.jpg",
    featured: false,
  },
  {
    name: "Accessories",
    slug: "accessories",
    href: "/shop/accessories",
    description: "Complete your look with premium accessories",
    image: "/categories/accessories.jpg",
    featured: false,
    subcategories: [
      { name: "Belts", slug: "belts" },
      { name: "Watches", slug: "watches" },
      { name: "Wallets", slug: "wallets" },
      { name: "Caps", slug: "caps" },
      { name: "Socks", slug: "socks" },
      { name: "Ties", slug: "ties" },
    ],
  },
] as const;

/**
 * Collection-type categories (seasonal / themed)
 */
export const collections = [
  { name: "New Arrivals", slug: "new-arrivals", href: "/new-arrivals" },
  { name: "Best Sellers", slug: "best-sellers", href: "/best-sellers" },
  { name: "Winter Collection", slug: "winter-collection", href: "/shop/winter-collection" },
  { name: "Summer Collection", slug: "summer-collection", href: "/shop/summer-collection" },
  { name: "Premium Collection", slug: "premium-collection", href: "/shop/premium-collection" },
  { name: "Sale", slug: "sale", href: "/sale" },
] as const;

/**
 * Main navigation links (top-level + dropdowns)
 */
export const mainNav = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop", hasMegaMenu: true },
  { title: "New Arrivals", href: "/new-arrivals" },
  { title: "Best Sellers", href: "/best-sellers" },
  { title: "Sale", href: "/sale", highlight: true },
  { title: "Lookbook", href: "/lookbook" },
  { title: "Blog", href: "/blog" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
] as const;

/**
 * Footer navigation
 */
export const footerNav = {
  shop: {
    title: "Shop",
    links: [
      { title: "All Products", href: "/shop" },
      { title: "New Arrivals", href: "/new-arrivals" },
      { title: "Best Sellers", href: "/best-sellers" },
      { title: "Sale", href: "/sale" },
      { title: "Gift Cards", href: "/gift-cards" },
    ],
  },
  categories: {
    title: "Top Categories",
    links: [
      { title: "Panjabi Collection", href: "/shop/panjabi-collection" },
      { title: "Sherwani", href: "/shop/sherwani" },
      { title: "Shirts", href: "/shop/shirts" },
      { title: "Blazers", href: "/shop/blazers" },
      { title: "Accessories", href: "/shop/accessories" },
    ],
  },
  customer: {
    title: "Customer Service",
    links: [
      { title: "My Account", href: "/dashboard" },
      { title: "Track Order", href: "/track-order" },
      { title: "FAQ", href: "/faq" },
      { title: "Contact Us", href: "/contact" },
      { title: "Size Guide", href: "/size-guide" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Blog", href: "/blog" },
      { title: "Lookbook", href: "/lookbook" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms & Conditions", href: "/terms" },
    ],
  },
  policies: {
    title: "Policies",
    links: [
      { title: "Return & Refund", href: "/return-policy" },
      { title: "Shipping Policy", href: "/shipping-policy" },
      { title: "Terms & Conditions", href: "/terms" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "FAQ", href: "/faq" },
    ],
  },
} as const;

/**
 * Available sizes per category type
 */
export const sizeGuides = {
  clothing: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
  panjabi: ["38", "40", "42", "44", "46"],
  pants: ["30", "32", "34", "36", "38", "40"],
  shoes: ["39", "40", "41", "42", "43", "44", "45"],
  accessories: ["Free Size"],
} as const;

/**
 * Payment methods supported
 */
export const paymentMethods = [
  { id: "sslcommerz", name: "SSLCommerz", logo: "/payments/sslcommerz.png" },
  { id: "stripe", name: "Stripe", logo: "/payments/stripe.png" },
  { id: "bkash", name: "bKash", logo: "/payments/bkash.png" },
  { id: "nagad", name: "Nagad", logo: "/payments/nagad.png" },
  { id: "rocket", name: "Rocket", logo: "/payments/rocket.png" },
  { id: "cod", name: "Cash on Delivery", logo: "/payments/cod.png" },
] as const;

/**
 * Shipping providers
 */
export const shippingProviders = [
  { id: "pathao", name: "Pathao", logo: "/shipping/pathao.png" },
  { id: "steadfast", name: "SteadFast", logo: "/shipping/steadfast.png" },
  { id: "redx", name: "RedX", logo: "/shipping/redx.png" },
  { id: "sundarban", name: "Sundarban Courier", logo: "/shipping/sundarban.png" },
] as const;
