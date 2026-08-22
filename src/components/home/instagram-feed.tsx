"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";

/**
 * Instagram Feed Section
 *
 * Social media showcase grid (placeholder images for now)
 */
export function InstagramFeed() {
  const posts = [
    { gradient: "linear-gradient(135deg, #1a1a1f, #36454f)" },
    { gradient: "linear-gradient(135deg, #b8860b, #8b6f47)" },
    { gradient: "linear-gradient(135deg, #0f5132, #556b2f)" },
    { gradient: "linear-gradient(135deg, #800020, #1a1a1f)" },
    { gradient: "linear-gradient(135deg, #d2b48c, #f5f1e8)" },
    { gradient: "linear-gradient(135deg, #1a237e, #0d1117)" },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <SectionHeading
          eyebrow="Follow Us"
          title="@rakibpanjabihouse"
          subtitle="Tag us in your photos for a chance to be featured. Get inspired by our community of style enthusiasts."
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {posts.map((post, idx) => (
            <Link
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md"
              style={{ background: post.gradient }}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                <Instagram className="h-8 w-8 text-white" />
              </div>

              {/* Placeholder monogram */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-3xl font-light text-white/20">
                  RPH
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <Instagram className="h-4 w-4" />
            Follow us on Instagram
          </a>
        </div>
      </Container>
    </section>
  );
}
