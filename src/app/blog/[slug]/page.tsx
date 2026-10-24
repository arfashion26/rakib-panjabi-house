import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase";
import { siteConfig } from "@/lib/brand";
import { BlogPostActions } from "@/components/blog/blog-post-actions";

export const revalidate = 300; // 5 min ISR — refresh post data periodically
export const dynamicParams = true; // allow new slugs to be generated on-demand

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  is_featured: boolean | null;
  published_at: string | null;
  created_at: string;
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "PUBLISHED")
      .maybeSingle();
    if (error || !data) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found | alrakib.com",
      description: "The requested blog post could not be found.",
    };
  }

  // Fall back to post title / excerpt if meta fields are not set
  const metaTitle = post.meta_title || `${post.title} | alrakib.com`;
  const metaDescription =
    post.meta_description || post.excerpt || `Read ${post.title} on alrakib.com`;
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const ogImage = post.cover_image || undefined;

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: ogImage ? [{ url: ogImage }] : undefined,
      publishedTime: post.published_at || post.created_at,
      authors: [siteConfig.name],
      tags: Array.isArray(post.tags) ? post.tags : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

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
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 200));
}

/**
 * Render post content with paragraph spacing.
 * Splits on double-newlines (blank line between paragraphs).
 */
function renderContent(content: string | null) {
  if (!content) return null;
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((para, i) => (
    <p
      key={i}
      className="mb-4 whitespace-pre-line text-base leading-relaxed text-foreground/90"
    >
      {para}
    </p>
  ));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const dateStr = formatDate(post.published_at || post.created_at);
  const readMinutes = getReadTime(post.content);
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <>
      {/* Hero with cover image */}
      <section className="relative min-h-[420px] md:min-h-[480px]">
        {post.cover_image ? (
          <>
            <div className="absolute inset-0">
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </div>
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #1a1a1f 0%, #36454f 50%, #1a1a1f 100%)",
            }}
          />
        )}
        <Container className="relative flex min-h-[420px] flex-col items-center justify-center py-16 text-center text-white md:min-h-[480px]">
          <div className="mx-auto max-w-3xl">
            {post.category && (
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
                {post.category}
              </Badge>
            )}
            <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/85">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {dateStr}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readMinutes} min read
              </span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Client-side actions (Share / Save / CTA) */}
          <BlogPostActions
            title={post.title}
            backLabel="← Back to Blog"
            shareLabel="Share"
            saveLabel="Save"
            shareArticleLabel="Share Article"
            shopCollectionLabel="Shop Collection"
            enjoyedTitle="Enjoyed this article?"
            enjoyedDesc="Share it with your friends and explore our premium collection."
          />

          {/* Article content */}
          <article className="prose prose-sm max-w-none md:prose-base">
            {renderContent(post.content)}
          </article>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Tag className="h-3 w-3" />
                Tags
              </span>
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          {/* Back to blog link */}
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse all articles
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
