import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rakib Panjabi House",
    short_name: "Rakib PH",
    description:
      "Premium Panjabi & Fashion for the Modern Gentleman. Shop premium quality Panjabis, shirts, pants, and ethnic wear.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#1a1a1f",
    orientation: "portrait-primary",
    categories: ["shopping", "fashion", "lifestyle"],
    icons: [
      {
        src: "/logo.jpg",
        sizes: "any",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Shop",
        short_name: "Shop",
        description: "Browse all products",
        url: "/shop",
      },
      {
        name: "New Arrivals",
        short_name: "New",
        description: "See latest products",
        url: "/new-arrivals",
      },
      {
        name: "Sale",
        short_name: "Sale",
        description: "Shop items on sale",
        url: "/sale",
      },
      {
        name: "Cart",
        short_name: "Cart",
        description: "View your cart",
        url: "/cart",
      },
    ],
  };
}
