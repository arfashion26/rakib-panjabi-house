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

/**
 * Top announcement bar (above header) — gold accent
 * Shows phone, announcement text, language toggle, currency
 */
function AnnouncementBar() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-9 items-center justify-between text-xs">
          {/* Left: phone (desktop only) */}
          <div className="hidden items-center gap-2 md:flex">
            <Phone className="h-3 w-3" />
            <span className="font-medium">{siteConfig.phone}</span>
          </div>

          {/* Center: announcement text */}
          <div className="flex-1 text-center md:flex-none">
            <span className="font-medium tracking-wide">
              {t("announcement.text")}
            </span>
          </div>

          {/* Right: language toggle + currency (desktop only) */}
          <div className="hidden items-center gap-3 md:flex">
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
            <span className="font-medium">৳ BDT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mega menu for Shop dropdown
 */
function ShopMegaMenu() {
  const featuredCategories = categories.filter((c) => c.featured).slice(0, 4);
  const { t } = useLanguage();
  return (
    <NavigationMenuContent>
      <div className="grid w-[600px] gap-3 p-6 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("products.categories")}
          </h3>
          <ul className="grid grid-cols-2 gap-1">
            {categories.slice(0, 12).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className="block rounded-md px-3 py-2 text-sm leading-none no-underline transition-colors hover:bg-accent/10 hover:text-accent"
                >
                  <div className="font-medium text-foreground">{cat.name}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {cat.description}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-accent/15 to-accent/5 p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
            {t("categories.title")}
          </h3>
          <div className="space-y-1">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="block rounded-md p-2 text-sm no-underline transition-colors hover:bg-white/40"
              >
                <div className="font-medium">{cat.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {cat.description}
                </div>
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
 * Logo component — circular logo image
 */
function HeaderLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  return (
    <Link href="/" aria-label="Al-Rakib Panjabi House - Home" className="flex items-center gap-2.5 group">
      <div className={cn("relative shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40 transition-transform group-hover:scale-105", dim)}>
        <img
          src="/logo.jpg"
          alt="Al-Rakib Panjabi House"
          className="h-full w-full object-cover"
          width={size === "sm" ? 40 : 48}
          height={size === "sm" ? 40 : 48}
        />
      </div>
      <div className="hidden flex-col leading-none sm:flex">
        <span className="font-serif text-sm font-semibold text-primary-foreground">
          Al-Rakib
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-accent">
          Panjabi House
        </span>
      </div>
    </Link>
  );
}

/**
 * Desktop header — single row on black background
 * Layout: Logo (left) | Navigation (center) | Search + Actions (right)
 */
function DesktopHeader() {
  const pathname = usePathname();
  const totalItems = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);
  const { t } = useLanguage();

  const navTitleMap: Record<string, string> = {
    "Home": "nav.home",
    "Shop": "nav.shop",
    "New Arrivals": "nav.newArrivals",
    "Best Sellers": "nav.bestSellers",
    "Sale": "nav.sale",
    "Lookbook": "nav.lookbook",
    "Blog": "nav.blog",
    "About Us": "nav.aboutUs",
    "Contact": "nav.contact",
  };

  return (
    <div className="hidden border-b border-primary-foreground/10 bg-primary md:block">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Left: Logo */}
          <div className="flex items-center">
            <HeaderLogo size="md" />
          </div>

          {/* Center: Navigation */}
          <nav className="flex-1">
            <NavigationMenu>
              <NavigationMenuList className="flex-wrap justify-center gap-0.5">
                {mainNav.map((item) =>
                  item.hasMegaMenu ? (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-sm font-medium tracking-wide text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                        {navTitleMap[item.title] ? t(navTitleMap[item.title]) : item.title}
                      </NavigationMenuTrigger>
                      <ShopMegaMenu />
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.href}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "h-9 bg-transparent px-3 text-sm font-medium tracking-wide text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground",
                            item.highlight && "text-accent font-semibold",
                            pathname === item.href && "text-accent"
                          )}
                        >
                          {navTitleMap[item.title] ? t(navTitleMap[item.title]) : item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <SearchBar />

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-primary-foreground/15" />

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Wishlist"
              className="h-9 w-9 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/wishlist">
                <Heart className="h-[18px] w-[18px]" />
              </Link>
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Account"
              className="h-9 w-9 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/dashboard">
                <User className="h-[18px] w-[18px]" />
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="relative h-9 w-9 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground"
              onClick={openCart}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
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

  const navTitleMap: Record<string, string> = {
    "Home": "nav.home",
    "Shop": "nav.shop",
    "New Arrivals": "nav.newArrivals",
    "Best Sellers": "nav.bestSellers",
    "Sale": "nav.sale",
    "Lookbook": "nav.lookbook",
    "Blog": "nav.blog",
    "About Us": "nav.aboutUs",
    "Contact": "nav.contact",
  };

  return (
    <div className="border-b border-primary-foreground/10 bg-primary text-primary-foreground md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Menu button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="h-10 w-10 text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto bg-background p-0">
            <SheetHeader className="border-b border-border bg-primary px-4 py-4">
              <SheetTitle className="flex items-center justify-between">
                <HeaderLogo size="sm" />
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

            {/* Mobile nav */}
            <div className="flex flex-col gap-0.5 p-3">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-accent/5",
                    item.highlight && "text-accent"
                  )}
                >
                  {navTitleMap[item.title] ? t(navTitleMap[item.title]) : item.title}
                  {item.highlight && (
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">
                      SALE
                    </span>
                  )}
                </Link>
              ))}

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

              {/* Language toggle */}
              <div className="my-3 border-t border-border" />
              <div className="px-3">
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

              {/* Contact info */}
              <div className="my-3 border-t border-border" />
              <div className="px-3 space-y-2">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent">
                  <Phone className="h-3 w-3" />
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent">
                  <Search className="h-3 w-3" />
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Center: Logo */}
        <Link href="/" aria-label="Home" className="absolute left-1/2 -translate-x-1/2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-accent/40">
            <img
              src="/logo.jpg"
              alt="Al-Rakib Panjabi House"
              className="h-full w-full object-cover"
              width={36}
              height={36}
            />
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Search"
            className="h-9 w-9 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/shop">
              <Search className="h-[18px] w-[18px]" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Wishlist"
            className="h-9 w-9 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/wishlist">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative h-9 w-9 text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground"
            onClick={openCart}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Site Header - composed of AnnouncementBar + Desktop/Mobile headers
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <AnnouncementBar />
      <DesktopHeader />
      <MobileHeader />
      <CartDrawer />
    </header>
  );
}
