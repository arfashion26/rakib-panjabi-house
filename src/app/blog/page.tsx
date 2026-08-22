"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const posts = [
  {
    id: "1",
    title: "The Art of Choosing the Perfect Panjabi",
    slug: "art-of-choosing-perfect-panjabi",
    excerpt: "A comprehensive guide to selecting the right fabric, fit, and style for any occasion — from casual gatherings to formal ceremonies.",
    category: "Style Guide",
    date: "Aug 15, 2026",
    readTime: "5 min read",
    gradient: "linear-gradient(135deg, #0f5132, #1a1a1f)",
    featured: true,
  },
  {
    id: "2",
    title: "5 Ways to Style a Sherwani for Wedding Season",
    slug: "styling-sherwani-wedding",
    excerpt: "Discover versatile styling options that make your sherwani work for multiple wedding functions and celebrations.",
    category: "Fashion Tips",
    date: "Aug 8, 2026",
    readTime: "4 min read",
    gradient: "linear-gradient(135deg, #b8860b, #800020)",
    featured: false,
  },
  {
    id: "3",
    title: "Caring for Your Premium Ethnic Wear",
    slug: "caring-premium-ethnic-wear",
    excerpt: "Essential tips for maintaining the quality and longevity of your favorite panjabis, sherwanis, and kurtas.",
    category: "Care Guide",
    date: "Aug 1, 2026",
    readTime: "6 min read",
    gradient: "linear-gradient(135deg, #1a237e, #0d1117)",
    featured: false,
  },
  {
    id: "4",
    title: "Winter Fashion Trends 2026",
    slug: "winter-fashion-trends-2026",
    excerpt: "Stay ahead of the curve with our predictions for the top winter fashion trends of 2026.",
    category: "Trends",
    date: "Jul 25, 2026",
    readTime: "7 min read",
    gradient: "linear-gradient(135deg, #556b2f, #1a1a1f)",
    featured: false,
  },
  {
    id: "5",
    title: "The History of the Panjabi: A Cultural Icon",
    slug: "history-of-panjabi",
    excerpt: "Trace the fascinating journey of the panjabi from its traditional roots to its modern-day status as a fashion staple.",
    category: "Culture",
    date: "Jul 18, 2026",
    readTime: "8 min read",
    gradient: "linear-gradient(135deg, #800020, #1a1a1f)",
    featured: false,
  },
  {
    id: "6",
    title: "How to Accessorize Your Ethnic Look",
    slug: "accessorize-ethnic-look",
    excerpt: "Complete your traditional outfit with the right accessories — from mojaris to watches and everything in between.",
    category: "Fashion Tips",
    date: "Jul 10, 2026",
    readTime: "5 min read",
    gradient: "linear-gradient(135deg, #8b6f47, #1a1a1f)",
    featured: false,
  },
];

const categories = ["All", "Style Guide", "Fashion Tips", "Care Guide", "Trends", "Culture"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");

  const featuredPost = posts.find((p) => p.featured);
  const filteredPosts = posts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Hero header */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              The Rakib Journal
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              Style Stories & Insights
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Discover fashion tips, style guides, cultural stories, and the latest
              trends from the world of premium menswear.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {/* Featured post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group mb-12 grid gap-6 rounded-lg border border-border/60 bg-card overflow-hidden md:grid-cols-2"
          >
            <div
              className="relative aspect-[16/10] md:aspect-auto"
              style={{ background: featuredPost.gradient }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-7xl font-light text-white/20">RPH</span>
              </div>
              <div className="absolute left-4 top-4">
                <Badge className="bg-accent text-accent-foreground">Featured</Badge>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{featuredPost.category}</Badge>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {featuredPost.date}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {featuredPost.readTime}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-medium leading-tight md:text-3xl">
                {featuredPost.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {featuredPost.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                Read More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article key={post.id} className="group flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-[16/10] overflow-hidden rounded-lg"
                style={{ background: post.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-5xl font-light text-white/20">RPH</span>
                </div>
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="mt-4 flex flex-1 flex-col">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </div>
                <h3 className="font-serif text-xl font-medium leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  Read More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium">No articles found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different search or category</p>
          </div>
        )}
      </Container>
    </>
  );
}
