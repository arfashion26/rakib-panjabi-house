"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  published_at: string | null;
  created_at: string;
}

const GRADIENTS = [
  "linear-gradient(135deg, #1a1a1f, #36454f)",
  "linear-gradient(135deg, #b8860b, #8b6f47)",
  "linear-gradient(135deg, #0f5132, #556b2f)",
  "linear-gradient(135deg, #800020, #1a1a1f)",
  "linear-gradient(135deg, #1a237e, #0d1117)",
  "linear-gradient(135deg, #8b6f47, #1a1a1f)",
];

export default function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog-posts");
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Extract unique categories from posts
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [posts]);

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

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
    if (!content) return 3;
    const words = content.split(/\s+/).length;
    return Math.max(2, Math.ceil(words / 200));
  }

  return (
    <>
      {/* Hero header */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
              {t("blog.title")}
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              {t("blog.title")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("blog.subtitle")}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm font-medium">{t("blog.noPosts")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("blog.noPostsDesc")}</p>
          </div>
        ) : (
          <>
            {/* Featured post (first one) */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group mb-12 grid gap-0 overflow-hidden rounded-lg border border-border/60 bg-card md:grid-cols-2"
              >
                <div
                  className="relative aspect-[16/10] md:aspect-auto"
                  style={featuredPost.cover_image ? undefined : { background: GRADIENTS[0] }}
                >
                  {featuredPost.cover_image ? (
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-7xl font-light text-white/20">RPH</span>
                    </div>
                  )}
                  <div className="absolute left-4 top-4">
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    {featuredPost.category && <Badge variant="secondary">{featuredPost.category}</Badge>}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(featuredPost.published_at || featuredPost.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getReadTime(featuredPost.content)} {t("blog.minRead")}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-medium leading-tight md:text-3xl">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text">
                    {t("blog.readMore")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}

            {/* Filters */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("blog.categories")}
                </span>
                <button
                  onClick={() => setActiveCategory("All")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                    activeCategory === "All"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {t("blog.allPosts")}
                </button>
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
                  placeholder={t("blog.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post, idx) => (
                <article key={post.id} className="group flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] overflow-hidden rounded-lg"
                    style={post.cover_image ? undefined : { background: GRADIENTS[(idx + 1) % GRADIENTS.length] }}
                  >
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-5xl font-light text-white/20">RPH</span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                        {post.category || "General"}
                      </span>
                    </div>
                  </Link>
                  <div className="mt-4 flex flex-1 flex-col">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.published_at || post.created_at)}
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      {getReadTime(post.content)} {t("blog.minRead")}
                    </div>
                    <h3 className="font-serif text-xl font-medium leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-accent-text">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
                    >
                      {t("blog.readMore")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm font-medium">{t("blog.noPosts")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("blog.noPostsDesc")}</p>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
