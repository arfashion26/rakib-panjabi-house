"use client";

import * as React from "react";
import Link from "next/link";
import { Container, ButtonLink, SectionHeading } from "@/components/layout/container";
import { Award, Heart, Sparkles, Users } from "lucide-react";

/**
 * Brand Story Section
 *
 * Highlights the heritage and craftsmanship behind Rakib Panjabi House
 */
export function BrandStory() {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Every piece is crafted with superior fabrics and meticulous attention to detail, ensuring exceptional longevity and comfort.",
    },
    {
      icon: Heart,
      title: "Crafted with Care",
      description:
        "Our artisans bring decades of experience, combining traditional techniques with modern design sensibilities.",
    },
    {
      icon: Sparkles,
      title: "Timeless Designs",
      description:
        "Each design balances classic elegance with contemporary style, creating pieces that transcend seasonal trends.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "From personalized styling advice to seamless returns, we put our customers at the heart of everything we do.",
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Visual */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-accent/20 via-muted to-primary/5">
              {/* Decorative monogram */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-serif text-[200px] font-light leading-none text-accent/15">
                    RPH
                  </div>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    Est. 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative border */}
            <div className="absolute inset-4 rounded-lg border border-accent/20" />
            <div className="absolute inset-8 rounded-lg border border-accent/10" />

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 rounded-lg bg-background p-5 shadow-xl">
              <div className="font-serif text-3xl font-medium text-accent">
                10+
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                Years of
                <br />
                Excellence
              </div>
            </div>
          </div>

          {/* Right: Story content */}
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="A Legacy of Craftsmanship"
              subtitle="Rakib Panjabi House was founded with a singular vision — to bring premium quality ethnic and contemporary fashion to the modern Bangladeshi gentleman."
              align="left"
              className="mb-6"
            />
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              From our humble beginnings in Dhaka, we have grown into a trusted
              destination for discerning customers who appreciate the finer details.
              Each piece in our collection is a testament to our commitment to
              quality, from the carefully sourced fabrics to the final stitches
              applied by our skilled artisans.
            </p>

            {/* Values grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-accent/40"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <ButtonLink href="/about">Discover Our Story</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
