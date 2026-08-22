"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";

/**
 * Blog Posts Section
 *
 * Featured blog posts preview on homepage
 */
export function BlogPosts() {
  const posts = [
    {
      title: "The Art of Choosing the Perfect Panjabi",
      excerpt:
        "A comprehensive guide to selecting the right fabric, fit, and style for any occasion — from casual gatherings to formal ceremonies.",
      category: "Style Guide",
      date: "Aug 15, 2026",
      readTime: "5 min read",
      gradient: "linear-gradient(135deg, #0f5132, #1a1a1f)",
    },
    {
      title: "5 Ways to Style a Sherwani for Wedding Season",
      excerpt:
        "Discover versatile styling options that make your sherwani work for multiple wedding functions and celebrations.",
      category: "Fashion Tips",
      date: "Aug 8, 2026",
      readTime: "4 min read",
      gradient: "linear-gradient(135deg, #b8860b, #800020)",
    },
    {
      title: "Caring for Your Premium Ethnic Wear",
      excerpt:
        "Essential tips for maintaining the quality and longevity of your favorite panjabis, sherwanis, and kurtas.",
      category: "Care Guide",
      date: "Aug 1, 2026",
      readTime: "6 min read",
      gradient: "linear-gradient(135deg, #1a237e, #0d1117)",
    },
  ];

  return (
    <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
      <Container>
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionHeading
            eyebrow="From Our Journal"
            title="Latest from the Blog"
            subtitle="Style tips, fashion insights, and stories from the world of premium menswear."
            align="left"
            className="mb-0 md:max-w-xl"
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            View All Posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, idx) => (
            <article key={idx} className="group flex flex-col">
              {/* Image */}
              <Link
                href="/blog"
                className="relative aspect-[16/10] overflow-hidden rounded-lg"
                style={{ background: post.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-5xl font-light text-white/20">
                    RPH
                  </span>
                </div>
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                    {post.category}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="mt-4 flex flex-1 flex-col">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <time>{post.date}</time>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-serif text-xl font-medium leading-snug text-foreground">
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                <Link
                  href="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
