"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationLoader
 *
 * Shows a branded spinning-circle overlay while the user navigates between
 * pages. The overlay appears the instant a Link is clicked and disappears
 * once the new route is committed.
 *
 * How it works:
 * 1. On mount, we attach a global `click` listener that inspects every
 *    clicked anchor. If the href targets a different internal path, we
 *    set `navigating=true` and show the overlay.
 * 2. `usePathname()` + `useSearchParams()` update when the new route is
 *    committed. A useEffect watching them clears `navigating=false`.
 * 3. Listens for a custom 'navigation-start' window event so programmatic
 *    router.push() calls (which don't fire click events on anchors) can
 *    also trigger the overlay. Used by the shop sidebar category switcher.
 * 4. A 6-second safety timeout hides the overlay even if something goes
 *    wrong so the user is never stuck.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hide the overlay whenever the route (pathname OR search params) changes
  React.useEffect(() => {
    setNavigating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [pathname, searchParams]);

  // Listen for clicks on internal links to start the overlay
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Ignore clicks with modifier keys (open in new tab, etc.)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Find the closest anchor (in case the click target is a child element)
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      // Skip if the link has a target other than _self or uses download
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external links, mailto, tel, hash-only links, and API routes
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("/api/")
      ) {
        return;
      }

      // Resolve the target path so we can compare to the current path
      let targetPath: string;
      try {
        const url = new URL(href, window.location.href);
        targetPath = url.pathname + url.search + url.hash;
      } catch {
        return;
      }

      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      if (targetPath === currentPath) return; // same page, no navigation

      // Start the overlay
      setNavigating(true);

      // Safety timeout — never let the overlay stay visible > 6s
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setNavigating(false);
      }, 6000);
    }

    // Listen for programmatic navigation events (e.g. router.push() from
    // the shop sidebar when switching categories — those don't fire click
    // events on anchors, so the click listener won't catch them).
    function handleProgrammaticNav() {
      setNavigating(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setNavigating(false);
      }, 6000);
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("navigation-start", handleProgrammaticNav);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("navigation-start", handleProgrammaticNav);
    };
  }, []);

  // Clean up the safety timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!navigating) return null;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      role="status"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm"
      style={{ animation: "navloader-fade-in 180ms ease-out" }}
    >
      {/* Branded spinner — two concentric rings with brand gold accent */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          {/* Outer ring — subtle gray track on white background */}
          <div className="absolute inset-0 rounded-full border-4 border-black/10" />
          {/* Spinning gold arc */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: "#fedc00",
              borderRightColor: "#fedc00",
              animation: "navloader-spin 700ms linear infinite",
            }}
          />
          {/* Inner gold dot — pulses for extra life */}
          <div
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            style={{ animation: "navloader-pulse 900ms ease-in-out infinite" }}
          />
        </div>
        {/* Brand text under the spinner — black on white backdrop */}
        <p className="font-serif text-sm font-medium uppercase tracking-[0.25em] text-black">
          alrakib.com
        </p>
      </div>

      {/* Inline keyframes so no separate CSS file is needed */}
      <style>{`
        @keyframes navloader-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes navloader-pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.6); }
        }
        @keyframes navloader-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
