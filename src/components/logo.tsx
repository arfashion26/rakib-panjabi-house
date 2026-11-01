"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Logo URL caching strategy:
 *
 * - cachedLogoUrl + fetchPromise: in-memory cache for the CURRENT page
 *   session. All Logo instances on the same page share one fetch.
 * - localStorage "logo_cache_v1": persists across page navigations and
 *   reloads so the logo renders instantly on first paint without waiting
 *   for the fetch. Without this, every full page reload would show the
 *   fallback `/logo.png` for a frame before the fetched URL replaces it.
 * - cachedVersion: a version counter stored in localStorage. When the
 *   admin uploads a new logo, the settings page calls `invalidateLogoCache()`
 *   which bumps this version. On the next mount, the Logo component
 *   detects the version change and refetches the URL.
 *
 * The version + cache-busting query param (`?v=N`) ensure the browser
 * never shows a stale image even if the URL itself is unchanged.
 */

const CACHE_KEY = "logo_cache_v1";
const VERSION_KEY = "logo_cache_version_v1";

let cachedLogoUrl: string | null = null;
let cachedVersion: number = 0;
let fetchPromise: Promise<{ url: string; version: number }> | null = null;

// Hydrate from localStorage on module load (client-side only)
if (typeof window !== "undefined") {
  try {
    const stored = window.localStorage.getItem(CACHE_KEY);
    if (stored) cachedLogoUrl = stored;
    const v = window.localStorage.getItem(VERSION_KEY);
    if (v) cachedVersion = parseInt(v, 10) || 0;
  } catch {
    // localStorage may be disabled (private mode) — fall back to in-memory only
  }
}

async function fetchLogoUrl(currentVersion: number): Promise<{ url: string; version: number }> {
  // If we have a cached URL and the version matches, return immediately.
  if (cachedLogoUrl && cachedVersion === currentVersion) {
    return { url: cachedLogoUrl, version: cachedVersion };
  }
  // Otherwise fetch fresh. Dedupe concurrent fetches.
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/brand-assets", { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => {
      const url = data?.logoUrl || "/logo.png";
      cachedLogoUrl = url;
      cachedVersion = currentVersion;
      // Persist to localStorage so the next page load renders instantly
      try {
        window.localStorage.setItem(CACHE_KEY, url);
        window.localStorage.setItem(VERSION_KEY, String(currentVersion));
      } catch {
        // ignore
      }
      return { url, version: currentVersion };
    })
    .catch(() => {
      const fallback = "/logo.png";
      cachedLogoUrl = fallback;
      return { url: fallback, version: currentVersion };
    })
    .finally(() => {
      fetchPromise = null;
    });
  return fetchPromise;
}

/**
 * Invalidate the logo cache. Called by the admin settings page after
 * saving a new logo. Bumps the version so all Logo instances refetch.
 */
export function invalidateLogoCache() {
  cachedVersion += 1;
  cachedLogoUrl = null;
  fetchPromise = null;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VERSION_KEY, String(cachedVersion));
      window.localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    // ignore
  }
  // Dispatch a custom event so mounted Logo components can update
  // their state without waiting for a remount.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("logo-cache-invalidated", { detail: { version: cachedVersion } }));
  }
}

/**
 * Hook to fetch the brand logo URL on the client.
 * Uses an in-memory + localStorage cache so all components share one fetch.
 * Falls back to /logo.png if the API is unreachable.
 *
 * The returned URL includes a cache-busting query param (`?v=N`) so the
 * browser never serves a stale image from its HTTP cache.
 */
export function useLogoUrl(): string {
  const [logoUrl, setLogoUrl] = React.useState<string>(cachedLogoUrl || "/logo.png");
  const [version, setVersion] = React.useState<number>(cachedVersion);

  React.useEffect(() => {
    let cancelled = false;
    fetchLogoUrl(version).then(({ url }) => {
      if (!cancelled && url !== logoUrl) {
        setLogoUrl(url);
      }
    });

    // Listen for cache invalidation events (fired by invalidateLogoCache)
    function handleInvalidate(e: Event) {
      const detail = (e as CustomEvent).detail;
      const newVersion = detail?.version ?? cachedVersion;
      setVersion(newVersion);
      fetchLogoUrl(newVersion).then(({ url }) => {
        if (!cancelled) setLogoUrl(url);
      });
    }
    window.addEventListener("logo-cache-invalidated", handleInvalidate);

    return () => {
      cancelled = true;
      window.removeEventListener("logo-cache-invalidated", handleInvalidate);
    };
  }, [version, logoUrl]);

  // Append cache-busting query param if the URL is from the DB (not the
  // default /logo.png which never changes)
  if (logoUrl && logoUrl !== "/logo.png" && logoUrl !== "/logo.jpg") {
    const sep = logoUrl.includes("?") ? "&" : "?";
    return `${logoUrl}${sep}v=${version}`;
  }
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
    sm: "h-10 sm:h-12",      // small: 40-48px tall
    md: "h-12 sm:h-16",     // medium: 48-64px tall
    lg: "h-16 sm:h-20",     // large: 64-80px tall
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
    <div className={cn("relative h-10 shrink-0 overflow-hidden aspect-[2/1]", className)}>
      <img
        src={logoUrl}
        alt="Al-Rakib .com"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
