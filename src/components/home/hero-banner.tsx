"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/layout/container";

/**
 * Hero Banner - Full-width premium hero
 *
 * Design: Large editorial-style hero with gradient overlay,
 * elegant typography, and dual CTA buttons
 */
export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -left-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20v40c11.046 0 20-8.954 20-20zm10 0c0 11.046 8.954 20 20 20V10c-11.046 0-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[600px] items-center py-16 md:py-24 lg:grid-cols-2 lg:gap-12 lg:py-32">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent-text">
              <Sparkles className="h-3 w-3" />
              New Autumn Collection 2026
            </div>

            <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
              Timeless Elegance,
              <br />
              <span className="italic text-accent-text">Modern Refinement</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg lg:mx-0">
              Discover the finest collection of premium Panjabis, shirts, and ethnic
              wear crafted with superior fabrics and impeccable attention to detail.
              Each piece tells a story of tradition meeting contemporary style.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <ButtonLink
                href="/shop"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
              >
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/new-arrivals"
                variant="outline"
                className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hover:border-primary-foreground/50 sm:w-auto"
              >
                New Arrivals
              </ButtonLink>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-primary-foreground/10 pt-6 lg:max-w-md">
              <div>
                <div className="font-serif text-2xl font-medium text-accent-text md:text-3xl">
                  10K+
                </div>
                <div className="mt-1 text-xs text-primary-foreground/60">
                  Happy Customers
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl font-medium text-accent-text md:text-3xl">
                  500+
                </div>
                <div className="mt-1 text-xs text-primary-foreground/60">
                  Premium Products
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl font-medium text-accent-text md:text-3xl">
                  4.9
                </div>
                <div className="mt-1 text-xs text-primary-foreground/60">
                  Customer Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual element */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              {/* Placeholder visual - will be replaced with real product image */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-serif text-9xl font-light text-accent-text/30">
                    RPH
                  </div>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-primary-foreground/40">
                    Premium Fashion
                  </p>
                </div>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-4 border border-accent/20 rounded" />
              <div className="absolute inset-6 border border-accent/10 rounded" />
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 rounded-lg bg-background p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-text">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Handcrafted
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Premium quality
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
    </section>
  );
}
