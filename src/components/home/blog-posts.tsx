"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

/**
 * Blog Posts Section
 *
 * Featured blog posts preview on homepage
 */
export function BlogPosts() {
  const { t } = useLanguage();
  const posts = [
    {
      title: t("blogSection.post1Title"),
      excerpt: t("blogSection.post1Excerpt"),
      category: t("blogSection.post1Category"),
      date: "Aug 15, 2026",
      readTime: t("blogSection.post1ReadTime"),
      gradient: "linear-gradient(135deg, #0f5132, #1a1a1f)",
    },
    {
      title: t("blogSection.post2Title"),
      excerpt: t("blogSection.post2Excerpt"),
      category: t("blogSection.post2Category"),
      date: "Aug 8, 2026",
      readTime: t("blogSection.post2ReadTime"),
      gradient: "linear-gradient(135deg, #b8860b, #800020)",
    },
    {
      title: t("blogSection.post3Title"),
      excerpt: t("blogSection.post3Excerpt"),
      category: t("blogSection.post3Category"),
      date: "Aug 1, 2026",
      readTime: t("blogSection.post3ReadTime"),
      gradient: "linear-gradient(135deg, #1a237e, #0d1117)",
    },
  ];

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
                  <span className="rounded-full bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">
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
                    className="transition-colors hover:text-accent-text"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                <Link
                  href="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
                >
                  {t("blogSection.readMore")}
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
