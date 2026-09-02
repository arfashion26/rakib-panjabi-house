"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";

/**
 * Premium Collection CTA - Full-width section
 */
export function PremiumCollectionCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground md:py-24">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent-text">
            Exclusive Edition
          </p>
          <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
            Discover Our Premium Collection
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
            Handpicked pieces crafted with the finest materials and utmost care.
            Each item in our premium collection represents the pinnacle of
            Bangladeshi craftsmanship and contemporary design.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/shop/premium-collection"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/lookbook"
              className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/30 px-8 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
