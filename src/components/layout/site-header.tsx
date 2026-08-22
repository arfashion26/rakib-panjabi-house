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
  Globe,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import {
  mainNav,
  categories,
  siteConfig,
} from "@/lib/brand";
import { useCart } from "@/lib/store";
import { CartDrawer } from "@/components/cart/cart-drawer";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Top announcement bar (above header)
 */
function AnnouncementBar() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-9 items-center justify-between text-xs">
          <div className="hidden md:flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>{siteConfig.phone}</span>
          </div>
          <div className="flex-1 text-center md:flex-none">
            <span className="font-medium tracking-wide">
              ✦ Free shipping on orders over ৳2000 — Shop the New Collection Today ✦
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:opacity-80">
                <Globe className="h-3 w-3" />
                <span>EN</span>
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>বাংলা</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-accent-foreground/60">|</span>
            <span>৳ BDT</span>
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
  return (
    <NavigationMenuContent>
      <div className="grid w-[600px] gap-3 p-6 md:grid-cols-[1.5fr_1fr]">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            All Categories
          </h3>
          <ul className="grid grid-cols-2 gap-2">
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
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
            Featured
          </h3>
          <div className="space-y-2">
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
            className="mt-4 block rounded-md bg-primary px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            View All Products
          </Link>
        </div>
      </div>
    </NavigationMenuContent>
  );
}

/**
 * Main desktop header
 *
 * Design: Premium 3-row layout
 * Row 1: Top action bar (search left, account/cart right) — cream background
 * Row 2: Logo centered on BLACK background (logo blends seamlessly)
 * Row 3: Navigation menu — black background with gold accents
 */
function DesktopHeader() {
  const pathname = usePathname();
  const totalItems = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);

  return (
    <div className="hidden md:block">
      {/* Top row: search + actions — light background */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left: Search */}
            <div className="flex-1 max-w-xs">
              <SearchBar />
            </div>

            {/* Right: Action icons */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Account">
                <Link href="/dashboard">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Cart" className="relative" onClick={openCart}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logo row — BLACK background so logo blends in */}
      <div className="bg-primary py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center">
            <Link href="/" aria-label="Al-Rakib Panjabi House - Home" className="group">
              <Logo size="lg" variant="light" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation row — BLACK background with gold accents */}
      <nav className="bg-primary border-t border-accent/20">
        <div className="mx-auto max-w-7xl px-4">
          <NavigationMenu className=" [&>div]:bg-transparent">
            <NavigationMenuList className="flex-wrap justify-center py-3">
              {mainNav.map((item) =>
                item.hasMegaMenu ? (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className="bg-transparent font-medium tracking-wide text-primary-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                      {item.title}
                    </NavigationMenuTrigger>
                    <ShopMegaMenu />
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent font-medium tracking-wide text-primary-foreground/90 hover:bg-accent hover:text-accent-foreground",
                          item.highlight && "text-accent font-semibold"
                        )}
                        data-active={pathname === item.href}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    </div>
  );
}

/**
 * Search bar with autocomplete placeholder
 */
function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  return (
    <div className="relative w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) {
            window.location.href = `/shop?q=${encodeURIComponent(query.trim())}`;
          }
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="h-9 w-full rounded-full border border-border bg-muted/50 pl-9 pr-4 text-sm focus:border-accent focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>
      </form>
      {open && query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-border bg-popover p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            Press Enter to search for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile header
 *
 * Design: Black background with centered logo
 * Top: Announcement bar (gold)
 * Logo row: Black background with centered logo
 * Action row: Menu (left), Search/Wishlist/Cart (right) on black bg
 */
function MobileHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const totalItems = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.openCart);

  return (
    <div className="md:hidden bg-primary text-primary-foreground">
      {/* Logo row — centered on black */}
      <div className="flex items-center justify-center py-4">
        <Link href="/" aria-label="Home">
          <Logo size="sm" variant="light" />
        </Link>
      </div>

      {/* Action row — black background */}
      <div className="flex items-center justify-between border-t border-accent/20 px-4 py-2.5">
        {/* Left: menu button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto bg-background">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Logo size="sm" />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium",
                    pathname === item.href
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-accent/5",
                    item.highlight && "text-accent"
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <div className="my-3 border-t border-border" />
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Center: spacer */}
        <div className="flex-1" />

        {/* Right: Action icons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild aria-label="Search" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            <Link href="/shop">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative text-primary-foreground hover:bg-accent hover:text-accent-foreground" onClick={openCart}>
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
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
