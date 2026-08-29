"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  Menu,
  Home,
  Store,
  ChevronRight,
  FileEdit,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  group: "main" | "catalog" | "content" | "system";
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, group: "main" },
  { href: "/admin/customers", label: "Customers", icon: Users, group: "main" },

  { href: "/admin/products", label: "Products", icon: Package, group: "catalog" },
  { href: "/admin/categories", label: "Categories", icon: Tag, group: "catalog" },
  { href: "/admin/coupons", label: "Coupons", icon: Tag, group: "catalog" },
  { href: "/admin/homepage", label: "Homepage", icon: Home, group: "catalog" },
  { href: "/admin/pages", label: "Pages", icon: FileEdit, group: "catalog" },

  { href: "/admin/banners", label: "Banners", icon: ImageIcon, group: "content" },
  { href: "/admin/blog", label: "Blog", icon: FileText, group: "content" },
  { href: "/admin/reviews", label: "Reviews", icon: Star, group: "content" },

  { href: "/admin/settings", label: "Settings", icon: Settings, group: "system" },
];

const groupLabels: Record<NavItem["group"], string> = {
  main: "Manage",
  catalog: "Catalog",
  content: "Content",
  system: "System",
};

const groupOrder: NavItem["group"][] = ["main", "catalog", "content", "system"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Don't show admin sidebar on login page — it should be a standalone page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Find current page label for breadcrumb
  const currentItem = navItems.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  );
  const pageTitle = currentItem?.label || "Admin";

  const sidebarContent = (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      {/* Logo / Brand */}
      <div className="border-b border-primary-foreground/10 p-5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 shadow-sm">
            <span className="font-serif text-xl font-bold text-accent">R</span>
          </div>
          <div>
            <p className="font-serif text-base font-semibold leading-tight">
              Rakib Panjabi
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/50">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav with grouped sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groupOrder.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/40">
                {groupLabels[group]}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isActive
                            ? "text-accent-foreground"
                            : "text-primary-foreground/50 group-hover:text-primary-foreground"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 text-accent-foreground/70" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-primary-foreground/10 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
          asChild
        >
          <Link href="/">
            <Store className="h-4 w-4" />
            View Store
          </Link>
        </Button>
        <form action="/api/auth/signout" method="post" className="contents">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground/70 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar (mobile) */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/30 bg-accent/10">
            <span className="font-serif text-sm font-bold text-accent">R</span>
          </div>
          <span className="font-serif text-base font-medium">{pageTitle}</span>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
          {sidebarContent}
        </aside>

        {/* Main content */}
        <main className="min-h-screen flex-1">
          {/* Desktop breadcrumb header */}
          <div className="hidden border-b border-border bg-background/80 backdrop-blur lg:block">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-8 py-4 text-sm">
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-accent"
              >
                Admin
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
              <span className="font-medium text-foreground">{pageTitle}</span>
            </div>
          </div>

          <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
