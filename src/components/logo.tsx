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
      const url = data?.logoUrl || "/logo.jpg";
      cachedLogoUrl = url;
      return url;
    })
    .catch(() => {
      cachedLogoUrl = "/logo.jpg";
      return cachedLogoUrl;
    });
  return fetchPromise;
}

/**
 * Hook to fetch the brand logo URL on the client.
 * Uses an in-memory cache so all components share one fetch.
 * Falls back to /logo.jpg if the API is unreachable.
 */
export function useLogoUrl(): string {
  const [logoUrl, setLogoUrl] = React.useState<string>(cachedLogoUrl || "/logo.jpg");
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
 * Fetches the logo URL from /api/brand-assets (DB-driven). Falls back to
 * /logo.jpg if the API is unreachable or no custom logo is set.
 *
 * The logo is a circular crest. Since the logo itself has a black background,
 * we display it WITHOUT any border or ring so it blends seamlessly with
 * the dark background behind it.
 */
export function Logo({
  variant = "default",
  showText = false,
  size = "md",
  className,
}: LogoProps) {
  const logoUrl = useLogoUrl();

  const sizes = {
    sm: { container: "h-12 w-12 sm:h-14 sm:w-14", text: "text-xs" },
    md: { container: "h-20 w-20 md:h-24 md:w-24", text: "text-sm" },
    lg: { container: "h-28 w-28 md:h-32 md:w-32", text: "text-base" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo image — circular crest, no border (blends with bg) */}
      <div className={cn("relative shrink-0 overflow-hidden rounded-full", s.container)}>
        <img
          src={logoUrl}
          alt="Al-Rakib Panjabi House Logo"
          className="h-full w-full object-cover"
          width={128}
          height={128}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif font-semibold tracking-tight",
              s.text,
              variant === "light" ? "text-white" : "text-foreground"
            )}
          >
            Al-Rakib
          </span>
          <span
            className={cn(
              "font-sans uppercase tracking-[0.2em]",
              size === "sm" ? "text-[8px]" : "text-[10px]",
              variant === "light" ? "text-accent-text" : "text-muted-foreground"
            )}
          >
            Panjabi House
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact logo mark — icon only, for mobile header
 */
export function LogoMark({ className }: { className?: string }) {
  const logoUrl = useLogoUrl();

  return (
    <div className={cn("relative h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
      <img
        src={logoUrl}
        alt="Al-Rakib Panjabi House"
        className="h-full w-full object-cover"
        width={40}
        height={40}
      />
    </div>
  );
}
