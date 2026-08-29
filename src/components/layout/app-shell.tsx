"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

/**
 * AppShell — Wraps all pages with Header + Footer.
 *
 * Excludes header/footer for:
 * - /admin/* (admin panel has its own sidebar)
 * - /dashboard/* (user dashboard has its own sidebar)
 * - /login, /register, /forgot-password (auth pages have centered layout)
 *
 * Auth pages use the (auth) route group with its own layout.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes that have their own full-page layout (no header/footer)
  // ALL /admin/* routes are standalone (admin panel has its own sidebar)
  const isStandaloneRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/login" ||
    pathname.startsWith("/login") ||
    pathname === "/register" ||
    pathname.startsWith("/register") ||
    pathname === "/forgot-password" ||
    pathname === "/thank-you" ||
    pathname.startsWith("/api");

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {/* Floating WhatsApp button — visible on all public pages */}
      <WhatsAppButton />
    </div>
  );
}
