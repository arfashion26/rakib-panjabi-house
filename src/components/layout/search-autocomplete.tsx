"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/types";

export interface SuggestionProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  image: string | null;
}

interface SearchAutocompleteProps {
  /** Autofocus the input on mount. */
  autoFocus?: boolean;
  /** Called when the user submits the form with Enter (no suggestion picked). */
  onSubmit?: (q: string) => void;
  className?: string;
}

/**
 * Reusable product search box with a live suggestions dropdown.
 *
 * Used by the desktop site header (BigSearchBar). The suggestions dropdown
 * is absolutely positioned relative to the input box, so it always appears
 * directly below the box and is constrained to the box's width — never
 * full-screen wide.
 *
 * Debounces 300ms, requires ≥2 chars, fetches /api/search-suggest,
 * shows product image + name + price (+ strikethrough if discounted),
 * a "View all results for '<q>'" link, and a small loading spinner.
 */
export function SearchAutocomplete({
  autoFocus = false,
  onSubmit,
  className,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<SuggestionProduct[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounced fetch
  React.useEffect(() => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search-suggest?q=${encodeURIComponent(trimmed)}&limit=8`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setSuggestions(data.products);
          setOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Autofocus (mobile overlay)
  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    if (onSubmit) onSubmit(query);
    else router.push(`/shop?q=${encodeURIComponent(query)}`);
  }

  const trimmed = q.trim();
  const showDropdown =
    open && trimmed.length >= 2 && (loading || suggestions.length > 0);

  return (
    <div ref={wrapperRef} className={`relative ${className ?? "w-full"}`}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full items-stretch"
      >
        <div className="relative flex flex-1 items-stretch">
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => trimmed.length >= 2 && setOpen(true)}
            placeholder="Search products…"
            aria-label="Search products"
            className="h-full w-full rounded-l-md border border-r-0 border-border bg-background pl-12 text-sm text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus:border-accent focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="flex h-full items-center gap-2 rounded-r-md bg-accent px-6 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {/* Suggestions dropdown — positioned directly below the input box,
          constrained to the box width (never full-screen wide). */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] w-full overflow-y-auto rounded-lg border border-border bg-background shadow-2xl">
          {loading && suggestions.length === 0 && (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              No products found for &ldquo;{trimmed}&rdquo;
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((p) => {
                const onSale =
                  p.discountPrice != null && p.discountPrice < p.price;
                return (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent/5"
                    >
                      {/* Thumbnail */}
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Search className="h-4 w-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      {/* Name + price */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {p.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          {onSale ? (
                            <>
                              <span className="text-sm font-semibold text-accent-text">
                                {formatPrice(p.discountPrice!)}
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(p.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-medium text-foreground">
                              {formatPrice(p.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
              {/* View all results */}
              <li className="border-t border-border/60">
                <Link
                  href={`/shop?q=${encodeURIComponent(trimmed)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold text-accent-text transition-colors hover:bg-accent/5"
                >
                  View all results for &ldquo;{trimmed}&rdquo;
                  <Search className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
