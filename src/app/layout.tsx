import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://rakib-panjabi-house.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rakib Panjabi House — Premium Panjabi & Fashion for Men",
    template: "%s | Rakib Panjabi House",
  },
  description:
    "Discover premium quality Panjabis, shirts, pants, and ethnic wear at Rakib Panjabi House. Shop the latest collections with timeless elegance, modern designs, and superior craftsmanship. Free shipping across Bangladesh.",
  keywords: [
    "Panjabi",
    "Men's fashion",
    "Panjabi House",
    "Bangladesh fashion",
    "Ethnic wear",
    "Sherwani",
    "Kurta",
    "Panjabi online shop",
    "Rakib Panjabi House",
    "Premium fashion",
  ],
  authors: [{ name: "Rakib Panjabi House" }],
  creator: "Rakib Panjabi House",
  publisher: "Rakib Panjabi House",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Rakib Panjabi House",
    title: "Rakib Panjabi House — Premium Panjabi & Fashion",
    description:
      "Premium quality Panjabis, shirts, and ethnic wear with timeless elegance and modern designs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rakib Panjabi House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakib Panjabi House — Premium Panjabi & Fashion",
    description:
      "Premium quality Panjabis, shirts, and ethnic wear with timeless elegance.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "bn-BD": `${siteUrl}/bn`,
    },
  },
  category: "shopping",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rakib Panjabi House",
    alternateName: "RPH",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "Premium quality Panjabis, shirts, pants, and ethnic wear with timeless elegance and modern designs.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+880-1XXX-XXXXXX",
      contactType: "customer service",
      email: "support@rakibpanjabihouse.com",
    },
    sameAs: [
      "https://facebook.com/rakibpanjabihouse",
      "https://instagram.com/rakibpanjabihouse",
      "https://youtube.com/@rakibpanjabihouse",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rakib Panjabi House",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
