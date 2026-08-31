"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, Package, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Big Text */}
        <div className="relative mb-8">
          <h1 className="font-serif text-[120px] font-bold leading-none tracking-tighter text-accent sm:text-[180px]">
            404
          </h1>
          <div className="absolute inset-x-0 -bottom-2 mx-auto h-px w-24 bg-accent/30" />
        </div>

        {/* Headline */}
        <h2 className="mb-3 font-serif text-2xl font-medium tracking-tight sm:text-3xl">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry — let&apos;s get you back on track.
        </p>

        {/* Primary CTAs */}
        <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[160px]">
            <Link href="/shop">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Secondary links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <Link
            href="/new-arrivals"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
          >
            <Package className="h-3.5 w-3.5" />
            New Arrivals
          </Link>
          <Link
            href="/best-sellers"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
          >
            <Package className="h-3.5 w-3.5" />
            Best Sellers
          </Link>
          <Link
            href="/sale"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
          >
            <Package className="h-3.5 w-3.5" />
            Sale
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-accent"
          >
            <Headphones className="h-3.5 w-3.5" />
            Contact Us
          </Link>
        </div>

        {/* Go back button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            <ArrowLeft className="h-3 w-3" />
            Or go back to the previous page
          </button>
        </div>
      </div>
    </div>
  );
}
