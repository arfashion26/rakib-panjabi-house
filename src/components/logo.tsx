"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Cache logo URL across all Logo instances on the same page
let cachedLogoUrl: string | null = null;
let fetchPromise: Promise<string> | null = null;

async function fetchLogoUrl(): Promise<string> {
  if (cachedLogoUrl) return cachedLogoUrl;
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch("/api/brand-assets")
    .then((r) => r.json())
    .then((data) => {
      const url = data?.logoUrl || "/logo.png";
      cachedLogoUrl = url;
      return url;
    })
    .catch(() => {
      cachedLogoUrl = "/logo.png";
      return cachedLogoUrl;
    });
  return fetchPromise;
}

/**
 * Hook to fetch the brand logo URL on the client.
 * Uses an in-memory cache so all components share one fetch.
 * Falls back to /logo.png if the API is unreachable.
 */
export function useLogoUrl(): string {
  const [logoUrl, setLogoUrl] = React.useState<string>(cachedLogoUrl || "/logo.png");
  React.useEffect(() => {
    if (!cachedLogoUrl) {
      fetchLogoUrl().then(setLogoUrl);
    } else if (logoUrl !== cachedLogoUrl) {
      setLogoUrl(cachedLogoUrl);
    }
  }, [logoUrl]);
  return logoUrl;
}

/**
 * Brand logo component.
 *
 * Uses the rectangular logo image (2:1 aspect ratio) which contains
 * the full brand identity (Al-Rakib .com + crest + tagline).
 * No separate text label is shown — the logo image IS the brand.
 *
 * The `showText` prop is kept for backward compatibility but is a no-op
 * (the new rectangular logo already contains all the text).
 */
export function Logo({
  variant = "default",
  showText = false, // kept for backward compat, no-op
  size = "md",
  className,
}: LogoProps) {
  const logoUrl = useLogoUrl();

  // Rectangular logo: 2:1 aspect ratio (width = 2 × height)
  // Sizes are height-based; width is 2× the height via aspect-[2/1]
  const sizes = {
    sm: "h-8 sm:h-10",      // small: 32-40px tall
    md: "h-10 sm:h-12",     // medium: 40-48px tall
    lg: "h-14 sm:h-16",     // large: 56-64px tall
  };

  return (
    <div className={cn("flex items-center", className)}>
      {/* Rectangular logo — aspect-[2/1], object-contain so the full
          logo is visible without cropping. */}
      <div className={cn("relative shrink-0 overflow-hidden aspect-[2/1]", sizes[size])}>
        <img
          src={logoUrl}
          alt="Al-Rakib .com"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

/**
 * Compact logo mark — rectangular logo, smaller size
 * (was circular mark, now uses the same rectangular logo)
 */
export function LogoMark({ className }: { className?: string }) {
  const logoUrl = useLogoUrl();

  return (
    <div className={cn("relative h-8 shrink-0 overflow-hidden aspect-[2/1]", className)}>
      <img
        src={logoUrl}
        alt="Al-Rakib .com"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
