"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  status: string;
  is_featured: boolean | null;
  published_at: string | null;
  created_at: string;
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #0f5132, #1a1a1f)",
  "linear-gradient(135deg, #b8860b, #800020)",
  "linear-gradient(135deg, #1a237e, #0d1117)",
  "linear-gradient(135deg, #1a1a1f, #36454f)",
  "linear-gradient(135deg, #8b6f47, #1a1a1f)",
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function getReadTime(content: string | null) {
  if (!content) return 2;
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 200));
}

/**
 * Blog Posts Section
 *
 * Featured blog posts preview on homepage.
 * Pulls real posts from /api/blog-posts (DB-driven, no more hardcoded content).
 *
 * Strategy:
 *  - Featured posts (is_featured=true) come first, sorted by published_at desc
 *  - Then fill up with the latest published posts
 *  - Show up to 3 cards
 */
export function BlogPosts() {
  const { t } = useLanguage();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog-posts");
        const data = await res.json();
        if (!cancelled && data.success) {
          const all = (data.posts || []) as BlogPost[];
          // Sort: featured first, then by published_at desc
          const sorted = [...all].sort((a, b) => {
            const aFeatured = a.is_featured ? 1 : 0;
            const bFeatured = b.is_featured ? 1 : 0;
            if (aFeatured !== bFeatured) return bFeatured - aFeatured;
            const aDate = new Date(a.published_at || a.created_at).getTime();
            const bDate = new Date(b.published_at || b.created_at).getTime();
            return bDate - aDate;
          });
          setPosts(sorted.slice(0, 3));
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-muted py-14 text-foreground md:py-20 lg:py-24">
      <Container>
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionHeading
            eyebrow={t("blogSection.eyebrow")}
            title={t("blogSection.title")}
            subtitle={t("blogSection.subtitle")}
            align="left"
            className="mb-0 md:max-w-xl"
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent-text hover:underline"
          >
            {t("blogSection.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border border-border/40 bg-background/50 p-4 animate-pulse"
              >
                <div className="aspect-[16/10] rounded-md bg-muted" />
                <div className="mt-4 h-3 w-24 rounded bg-muted" />
                <div className="mt-3 h-5 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
                <div className="mt-1 h-3 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background/40 py-14 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">{t("blog.noPosts")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("blog.noPostsDesc")}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, idx) => (
              <article key={post.id} className="group flex flex-col">
                {/* Cover image / gradient placeholder */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative aspect-[16/10] overflow-hidden rounded-lg"
                  style={
                    post.cover_image
                      ? undefined
                      : { background: FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length] }
                  }
                >
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-5xl font-light text-white/20">
                        RPH
                      </span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
                      {post.category || t("blog.generalCategory")}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="mt-4 flex flex-1 flex-col">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time>{formatDate(post.published_at || post.created_at)}</time>
                    <span>·</span>
                    <Clock className="h-3 w-3" />
                    <span>{getReadTime(post.content)} {t("blog.minRead")}</span>
                  </div>

                  <h3 className="font-serif text-xl font-medium leading-snug text-foreground">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-accent-text"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
                  >
                    {t("blogSection.readMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
