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
    <div className="bg-primary text-primary-foreground">
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
            <span className="text-primary-foreground/60">|</span>
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
 */
function DesktopHeader() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top row: search | logo | actions */}
        <div className="grid grid-cols-3 items-center py-5">
          {/* Left: Search */}
          <div className="flex items-center justify-start">
            <SearchBar />
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link href="/" aria-label="Rakib Panjabi House - Home">
              <Logo size="md" />
            </Link>
          </div>

          {/* Right: Action icons */}
          <div className="flex items-center justify-end gap-1">
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
            <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom row: Navigation */}
        <nav className="flex items-center justify-center border-t border-border/60 py-3">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNav.map((item) =>
                item.hasMegaMenu ? (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className="bg-transparent font-medium tracking-wide">
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
                          "bg-transparent font-medium tracking-wide",
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
        </nav>
      </div>
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
 */
function MobileHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden border-b border-border/60 bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: menu button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
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

        {/* Center: Logo */}
        <Link href="/" aria-label="Home">
          <Logo size="sm" />
        </Link>

        {/* Right: Action icons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild aria-label="Search">
            <Link href="/shop">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                0
              </span>
            </Link>
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
    </header>
  );
}
