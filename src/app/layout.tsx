import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { LanguageProvider } from "@/i18n/language-context";
import { getCustomCode } from "@/lib/services/custom-code";

// Force dynamic rendering so custom code changes appear immediately.
// Without this, the layout would be statically rendered at build time
// and custom code updates would not show until the next deploy.
export const dynamic = "force-dynamic";

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

const siteUrl = "https://alrakib.com";

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
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
    other: {
      rel: "icon",
      type: "image/jpeg",
      url: "/logo.jpg",
    },
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch custom tracking code from the database (admin-configurable).
  // Falls back to empty strings if DB is unreachable.
  const customCode = await getCustomCode();

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
      telephone: "+880-1716-243949",
      contactType: "customer service",
      email: "info@alrakib.com",
    },
    sameAs: [
      "https://www.facebook.com/Alrakibfashionhouse/",
      "https://www.instagram.com/alrakibpunjabihouse/",
      "https://www.youtube.com/@Al-RakibFashionHouse",
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
        {/* Custom tracking code for <head> (Google Analytics, FB Pixel, GTM, etc.) */}
        {customCode.head && (
          <div dangerouslySetInnerHTML={{ __html: customCode.head }} />
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {/* Custom tracking code for top of <body> (GTM noscript, early pixels) */}
        {customCode.body_top && (
          <div dangerouslySetInnerHTML={{ __html: customCode.body_top }} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AppShell>{children}</AppShell>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
        {/* Custom tracking code for bottom of <body> (chat widgets, conversion pixels) */}
        {customCode.body_bottom && (
          <div dangerouslySetInnerHTML={{ __html: customCode.body_bottom }} />
        )}
      </body>
    </html>
  );
}
