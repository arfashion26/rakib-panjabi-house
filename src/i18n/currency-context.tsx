"use client";

import * as React from "react";

export type Currency = "BDT" | "USD";

interface CurrencyContextValue {
  /** Currently selected display currency */
  currency: Currency;
  /** USD exchange rate (1 USD = rate BDT). Fetched from /api/brand-assets */
  usdRate: number;
  /** Switch the display currency */
  setCurrency: (c: Currency) => void;
  /** Toggle between BDT and USD */
  toggleCurrency: () => void;
  /** Format a BDT amount in the currently selected currency */
  formatPrice: (amountInBDT: number) => string;
  /** True until the first fetch of /api/brand-assets completes */
  loading: boolean;
}

const CurrencyContext = React.createContext<CurrencyContextValue | null>(null);

// Module-level cache for usdRate — shared across all hook consumers.
// Fetched once on the client, reused for subsequent page renders.
let cachedUsdRate: number | null = null;
let fetchPromise: Promise<number> | null = null;

async function fetchUsdRate(): Promise<number> {
  if (cachedUsdRate != null) return cachedUsdRate;
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch("/api/brand-assets")
    .then((r) => r.json())
    .then((data) => {
      const rate = typeof data?.usdRate === "number" && data.usdRate > 0
        ? data.usdRate
        : 110;
      cachedUsdRate = rate;
      return rate;
    })
    .catch(() => {
      cachedUsdRate = 110;
      return cachedUsdRate;
    });
  return fetchPromise;
}

const STORAGE_KEY = "rph-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Initial currency from localStorage (defaults to BDT on first visit)
  const [currency, setCurrencyState] = React.useState<Currency>("BDT");
  const [usdRate, setUsdRate] = React.useState<number>(cachedUsdRate ?? 110);
  const [loading, setLoading] = React.useState<boolean>(cachedUsdRate == null);

  // On mount: read saved currency from localStorage + fetch USD rate
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "BDT" || saved === "USD") {
        setCurrencyState(saved);
      }
    } catch {
      // localStorage might be unavailable (SSR, privacy mode) — silently ignore
    }

    if (cachedUsdRate == null) {
      fetchUsdRate().then((rate) => {
        setUsdRate(rate);
        setLoading(false);
      });
    } else {
      setUsdRate(cachedUsdRate);
      setLoading(false);
    }
  }, []);

  // Persist currency selection across page reloads
  const setCurrency = React.useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  const toggleCurrency = React.useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "BDT" ? "USD" : "BDT";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Format a BDT amount for display, converting to USD if needed.
  // - BDT: "৳1,200"
  // - USD: "$10.91" (2 decimals, since USD amounts are usually small)
  const formatPrice = React.useCallback(
    (amountInBDT: number) => {
      if (currency === "USD") {
        const usd = amountInBDT / (usdRate || 110);
        return `$${usd.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
      return `৳${amountInBDT.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
    },
    [currency, usdRate]
  );

  const value = React.useMemo(
    () => ({ currency, usdRate, setCurrency, toggleCurrency, formatPrice, loading }),
    [currency, usdRate, setCurrency, toggleCurrency, formatPrice, loading]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = React.useContext(CurrencyContext);
  if (!ctx) {
    // Fallback if used outside provider — should never happen, but safe default
    return {
      currency: "BDT",
      usdRate: 110,
      setCurrency: () => {},
      toggleCurrency: () => {},
      formatPrice: (a: number) => `৳${a.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      loading: false,
    };
  }
  return ctx;
}
