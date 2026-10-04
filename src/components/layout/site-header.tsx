"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  Truck,
  ShieldCheck,
  RefreshCw,
  Package,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mainNav,
  categories,
  siteConfig,
} from "@/lib/brand";
import { useCart } from "@/lib/store";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useLanguage } from "@/i18n/language-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useLogoUrl } from "@/components/logo";
import { useCurrency } from "@/i18n/currency-context";

/**
 * Top utility bar — gold accent
 * Layout: phone (left) | quick links (center) | language + currency (right)
 * Combines the old announcement bar with quick page links so customers
 * can reach important pages from anywhere.
 */
function TopBar() {
  const { locale, setLocale, t } = useLanguage();
  const { currency, toggleCurrency } = useCurrency();
  const pathname = usePathname();

  // Quick links shown in the top bar (right side, before lang/currency)
  const quickLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/track-order", label: "Track Order" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-9 items-center justify-between text-xs">
          {/* Left: phone (desktop only) */}
          <div className="hidden items-center gap-2 md:flex">
            <Phone className="h-3 w-3" />
            <span className="font-medium">{siteConfig.phone}</span>
          </div>

          {/* Center: announcement text (mobile shows just this) */}
          <div className="flex-1 text-center md:flex-none">
            <span className="font-medium tracking-wide">
              {t("announcement.text")}
            </span>
          </div>

          {/* Right: quick links + language + currency (desktop only) */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Quick page links */}
            <nav className="flex items-center gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors hover:text-accent-foreground/70",
                    pathname === link.href && "underline underline-offset-2"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <span className="text-accent-foreground/40">|</span>

            {/* Language toggle */}
            <div className="flex items-center gap-1 rounded-full bg-accent-foreground/10 px-1 py-0.5">
              <button
                onClick={() => setLocale("en")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                  locale === "en"
                    ? "bg-accent-foreground text-accent"
                    : "text-accent-foreground/70 hover:text-accent-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("bn")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                  locale === "bn"
                    ? "bg-accent-foreground text-accent"
                    : "text-accent-foreground/70 hover:text-accent-foreground"
                )}
              >
                বাংলা
              </button>
            </div>
            <span className="text-accent-foreground/40">|</span>

            {/* Currency toggle */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors hover:bg-accent-foreground/10"
              title={`Switch to ${currency === "BDT" ? "USD" : "BDT"}`}
              aria-label={`Switch currency (current: ${currency})`}
            >
              <span className={currency === "BDT" ? "text-accent" : "text-accent-foreground/50"}>
                ৳
              </span>
              <span className={currency === "BDT" ? "text-accent-foreground" : "text-accent-foreground/50"}>
                BDT
              </span>
              <span className="text-accent-foreground/30">/</span>
              <span className={currency === "USD" ? "text-accent" : "text-accent-foreground/50"}>
                $
              </span>
              <span className={currency === "USD" ? "text-accent-foreground" : "text-accent-foreground/50"}>
                USD
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mega menu for Shop dropdown — DB-driven categories
 */
function ShopMegaMenu() {
  const { t } = useLanguage();
  const [cats, setCats] = React.useState<Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    is_featured: boolean;
  }>>([]);

  React.useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.categories) {
          setCats(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const featuredCats = cats.filter((c) => c.is_featured).slice(0, 4);
  const allCats = cats.slice(0, 12);

  return (
    <NavigationMenuContent>
      <div className="grid w-[600px] gap-3 p-6 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("products.categories")}
          </h3>
          <ul className="grid grid-cols-2 gap-1">
            {allCats.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop/${cat.slug}`}
                  className="block rounded-md px-3 py-2 text-sm leading-none no-underline transition-colors hover:bg-accent/10 hover:text-accent-text"
                >
                  <div className="font-medium text-foreground">{cat.name}</div>
                  {cat.description && (
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {cat.description}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-accent/15 to-accent/5 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-text">
            {t("categories.title")}
          </h3>
          <div className="space-y-1">
            {featuredCats.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="block rounded-md p-2 text-sm no-underline transition-colors hover:bg-white/40"
              >
                <div className="font-medium">{cat.name}</div>
                {cat.description && (
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {cat.description}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <Link
            href="/shop"
            className="mt-4 block rounded-md bg-primary px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("shop.browseAll")}
          </Link>
        </div>
      </div>
    </NavigationMenuContent>
  );
}

/**
 * Logo component — rectangular logo image (2:1 aspect ratio).
 * No separate text label — the logo contains the full brand identity.
 */
function HeaderLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const logoUrl = useLogoUrl();
  const height = size === "sm" ? "h-9 sm:h-10" : "h-12 sm:h-14";
  return (
    <Link href="/" aria-label="Al-Rakib .com - Home" className="flex items-center group">
      <div className={cn("relative shrink-0 overflow-hidden aspect-[2/1] transition-transform group-hover:scale-105", height)}>
        <img
          src={logoUrl}
          alt="Al-Rakib .com"
          className="h-full w-full object-contain"
        />
      </div>
    </Link>
  );
}

/**
 * Desktop header — dark nav row on top + gold main bar below
 * Row 1 (dark bg): Navigation menu + language toggle + currency toggle
 * Row 2 (gold bg): Logo (left) | Big rectangular search bar (center) | Cart button (right)
 */
function DesktopHeader() {
  const pathname = usePathname();
  const totalItems = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);
  const { locale, setLocale, t } = useLanguage();
  const { currency, toggleCurrency } = useCurrency();

  // Fetch DB-driven nav items
  const [navItems, setNavItems] = React.useState<Array<{
    id: string;
    label: string;
    label_bn: string;
    href: string;
    sort_order: number;
    is_active: boolean;
    open_in_new_tab: boolean;
  }>>([]);

  React.useEffect(() => {
    fetch("/api/nav-menu")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.items?.length > 0) {
          setNavItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="hidden md:block">
      {/* Navigation row — dark background, at the very top (as before).
          Layout: DB-driven nav (left) | language + currency + Track My Order (right) */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex h-11 items-center justify-between gap-3">
            <nav className="flex-1 overflow-hidden">
              <NavigationMenu>
                <NavigationMenuList className="flex-wrap justify-start gap-1">
                  {navItems.length > 0 ? (
                    navItems.map((item) =>
                      item.href === "/shop" ? (
                        <NavigationMenuItem key={item.id}>
                          <NavigationMenuTrigger className="h-9 bg-transparent px-4 text-sm font-medium tracking-wide text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                            {locale === "bn" && item.label_bn ? item.label_bn : item.label}
                          </NavigationMenuTrigger>
                          <ShopMegaMenu />
                        </NavigationMenuItem>
                      ) : (
                        <NavigationMenuItem key={item.id}>
                          <Link
                            href={item.href}
                            legacyBehavior
                            passHref
                            target={item.open_in_new_tab ? "_blank" : undefined}
                          >
                            <NavigationMenuLink
                              className={cn(
                                navigationMenuTriggerStyle(),
                                "h-9 bg-transparent px-4 text-sm font-medium tracking-wide text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href && "text-accent"
                              )}
                            >
                              {locale === "bn" && item.label_bn ? item.label_bn : item.label}
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      )
                    )
                  ) : (
                    <NavigationMenuItem>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "h-9 bg-transparent px-4 text-sm text-primary-foreground/50")}>
                        Loading...
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Right: language toggle + currency toggle + Track My Order (rightmost) */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Language toggle */}
              <div className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-1 py-0.5">
                <button
                  onClick={() => setLocale("en")}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    locale === "en"
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => setLocale("bn")}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    locale === "bn"
                      ? "bg-accent text-accent-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  )}
                >
                  বাংলা
                </button>
              </div>

              {/* Currency toggle */}
              <button
                onClick={toggleCurrency}
                className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-colors hover:bg-primary-foreground/10"
                title={`Switch to ${currency === "BDT" ? "USD" : "BDT"}`}
                aria-label={`Switch currency (current: ${currency})`}
              >
                <span className={currency === "BDT" ? "text-accent" : "text-primary-foreground/50"}>
                  ৳
                </span>
                <span className={currency === "BDT" ? "text-primary-foreground" : "text-primary-foreground/50"}>
                  BDT
                </span>
                <span className="text-primary-foreground/30">/</span>
                <span className={currency === "USD" ? "text-accent" : "text-primary-foreground/50"}>
                  $
                </span>
                <span className={currency === "USD" ? "text-primary-foreground" : "text-primary-foreground/50"}>
                  USD
                </span>
              </button>

              {/* Track My Order — prominent link at the far right */}
              <Link
                href="/track-order"
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <Package className="h-3.5 w-3.5" />
                Track My Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar — gold background (as before).
          Logo (left) | Big rectangular search bar (center) | Cart button (right) */}
      <div className="border-b border-accent-foreground/10 bg-accent text-accent-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex h-24 items-center justify-between gap-6">
            {/* Left: Logo */}
            <div className="flex shrink-0 items-center">
              <HeaderLogo size="md" />
            </div>

            {/* Center: Big rectangular search bar (takes most of the space) */}
            <div className="flex-1 max-w-3xl">
              <BigSearchBar />
            </div>

            {/* Right: Cart button only (wishlist + account removed per request).
                Bigger, with a distinct background so it stands out on the gold
                main bar. Uses bg-background (white) so it's clearly visible. */}
            <div className="flex shrink-0 items-center">
              <Button
                variant="ghost"
                aria-label="Cart"
                className="relative h-16 w-16 gap-1 rounded-lg border border-accent-foreground/15 bg-background text-accent-foreground shadow-sm hover:bg-accent-foreground hover:text-accent"
                onClick={openCart}
              >
                <ShoppingBag className="h-7 w-7" />
                {totalItems > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-accent-foreground px-1.5 text-xs font-bold text-accent shadow ring-2 ring-background">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Big rectangular search bar — visible in the desktop header (gold bg).
 * Larger and rectangular (not pill-shaped) per user request.
 * No placeholder text (per request) — just the search icon + input.
 * Routes to /shop?q=QUERY on submit.
 */
function BigSearchBar() {
  const [q, setQ] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    const url = query ? `/shop?q=${encodeURIComponent(query)}` : "/shop";
    window.location.href = url;
  }

  return (
    <form onSubmit={onSubmit} className="flex h-14 items-stretch">
      {/* Input — has the search icon inside, no placeholder text */}
      <div className="relative flex flex-1 items-stretch">
        <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-full w-full rounded-l-md border border-r-0 border-accent-foreground/15 bg-background pl-12 text-sm shadow-sm transition-shadow focus:border-accent-foreground focus:bg-background focus:outline-none sm:text-base"
          aria-label="Search products"
        />
      </div>
      <button
        type="submit"
        className="flex h-full items-center gap-2 rounded-r-md bg-accent-foreground px-6 text-sm font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent-foreground/90"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}

/**
 * Search bar — compact, expands on focus
 */
function SearchBar() {
  const { t } = useLanguage();
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) {
            window.location.href = `/shop?q=${encodeURIComponent(query.trim())}`;
          }
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/50" />
          <input
            type="search"
            placeholder={t("common.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setExpanded(true)}
            onBlur={() => setExpanded(false)}
            className={cn(
              "h-9 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 pl-9 pr-4 text-sm text-primary-foreground placeholder:text-primary-foreground/40 transition-all focus:border-accent focus:bg-primary-foreground/10 focus:outline-none focus:ring-1 focus:ring-accent/30",
              expanded ? "w-56" : "w-40"
            )}
          />
        </div>
      </form>
    </div>
  );
}

/**
 * Mobile header — compact, single row with drawer menu
 * Layout: Menu (left) | Logo (center) | Cart (right)
 */
function MobileHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const totalItems = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);
  const { locale, setLocale, t } = useLanguage();
  const { currency, toggleCurrency } = useCurrency();
  const logoUrl = useLogoUrl();

  // Fetch DB-driven nav items
  const [navItems, setNavItems] = React.useState<Array<{
    id: string;
    label: string;
    label_bn: string;
    href: string;
    is_active: boolean;
    open_in_new_tab: boolean;
  }>>([]);

  React.useEffect(() => {
    fetch("/api/nav-menu")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.items?.length > 0) {
          setNavItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="md:hidden">
      {/* Main bar — gold background (matches desktop).
          Layout: Menu (left) | Logo (center) | Cart (right) */}
      <div className="bg-accent text-accent-foreground">
        <div className="flex h-16 items-center justify-between px-3">
          {/* Left: Menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="h-11 w-11 text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto bg-background p-0">
              <SheetHeader className="border-b border-border bg-primary px-4 py-4">
                <SheetTitle className="flex items-center justify-between">
                  <div className="relative h-8 overflow-hidden aspect-[2/1]">
                    <img
                      src={logoUrl}
                      alt="Al-Rakib .com"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile nav — DB-driven */}
              <div className="flex flex-col gap-0.5 p-3">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    target={item.open_in_new_tab ? "_blank" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-accent/10 text-accent-text"
                        : "text-foreground hover:bg-accent/5"
                    )}
                  >
                    {locale === "bn" && item.label_bn ? item.label_bn : item.label}
                  </Link>
                ))}

                {/* Track My Order — prominent link */}
                <Link
                  href="/track-order"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground"
                >
                  <Package className="h-4 w-4" />
                  Track My Order
                </Link>

                {/* Categories section */}
                <div className="my-3 border-t border-border" />
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("products.categories")}
                </p>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {categories.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={cat.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                {/* Language + Currency toggle */}
                <div className="my-3 border-t border-border" />
                <div className="px-3 space-y-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("dashboard.language")}
                    </p>
                    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                      <button
                        onClick={() => setLocale("en")}
                        className={cn(
                          "flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                          locale === "en" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLocale("bn")}
                        className={cn(
                          "flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                          locale === "bn" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                      >
                        বাংলা
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Currency
                    </p>
                    <button
                      onClick={toggleCurrency}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-medium transition-colors hover:bg-accent/10"
                    >
                      <span className={currency === "BDT" ? "text-accent-text font-bold" : "text-muted-foreground"}>
                        ৳ BDT
                      </span>
                      <span className="text-muted-foreground/50">/</span>
                      <span className={currency === "USD" ? "text-accent-text font-bold" : "text-muted-foreground"}>
                        $ USD
                      </span>
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="my-3 border-t border-border" />
                <div className="px-3 space-y-2">
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent-text">
                    <Phone className="h-3 w-3" />
                    {siteConfig.phone}
                  </a>
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent-text">
                    <Mail className="h-3 w-3" />
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Center: Logo (rectangular, no text label) */}
          <Link href="/" aria-label="Home" className="absolute left-1/2 -translate-x-1/2">
            <div className="relative h-9 overflow-hidden aspect-[2/1]">
              <img
                src={logoUrl}
                alt="Al-Rakib .com"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          {/* Right: Cart only (search removed per request) */}
          <div className="flex items-center gap-1">
            {/* Cart — big, prominent */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="relative h-12 w-12 rounded-lg border border-accent-foreground/15 bg-background text-accent-foreground hover:bg-accent-foreground hover:text-accent"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-foreground px-1 text-[10px] font-bold text-accent ring-2 ring-background">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Site Header - Desktop/Mobile headers + CartDrawer.
 * TopBar (announcement) removed by request — language + currency
 * toggles are now in the dark nav row, and the main bar (logo +
 * search + cart) has a gold background.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <DesktopHeader />
      <MobileHeader />
      <CartDrawer />
    </header>
  );
}
