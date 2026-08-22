"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading, ButtonLink } from "@/components/layout/container";
import { categories } from "@/lib/brand";

/**
 * Featured Categories Section
 *
 * Displays a grid of featured category cards with elegant hover effects
 */
export function FeaturedCategories() {
  const featured = categories.filter((c) => c.featured).slice(0, 4);

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionHeading
            eyebrow="Curated Selection"
            title="Shop by Category"
            subtitle="Explore our carefully curated categories, each crafted to deliver exceptional quality and timeless style."
            align="left"
            className="mb-0 md:max-w-xl"
          />
          <ButtonLink href="/shop" variant="ghost" className="shrink-0">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted"
            >
              {/* Background gradient placeholder (image will be added later) */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  background:
                    idx === 0
                      ? "linear-gradient(135deg, oklch(0.30 0.02 264), oklch(0.18 0.01 264))"
                      : idx === 1
                      ? "linear-gradient(135deg, oklch(0.72 0.13 75), oklch(0.50 0.10 60))"
                      : idx === 2
                      ? "linear-gradient(135deg, oklch(0.85 0.02 80), oklch(0.65 0.05 80))"
                      : "linear-gradient(135deg, oklch(0.40 0.03 145), oklch(0.25 0.02 145))",
                }}
              />

              {/* Dark overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
                  {cat.name}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-white/80">
                  {cat.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-accent">
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-2 group-hover:ring-accent/60" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
