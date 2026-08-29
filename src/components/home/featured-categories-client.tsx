"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading, ButtonLink } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #1a1a1f, #36454f)",
  "linear-gradient(135deg, #b8860b, #8b6f47)",
  "linear-gradient(135deg, #0f5132, #556b2f)",
  "linear-gradient(135deg, #800020, #1a1a1f)",
];

interface FeaturedCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export function FeaturedCategoriesClient({ featured }: { featured: FeaturedCategory[] }) {
  const { t } = useLanguage();

  if (featured.length === 0) return null;

  return (
    <section className="bg-background py-14 md:py-20 lg:py-24">
      <Container>
        <div className="mb-10 md:mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
          <SectionHeading
            eyebrow={t("categories.eyebrow")}
            title={t("categories.title")}
            subtitle={t("categories.subtitle")}
            align="left"
            className="mb-0 md:max-w-xl"
          />
          <ButtonLink href="/shop" variant="ghost" className="shrink-0">
            {t("categories.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ background: FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length] }}
                />
              )}

              {/* Dark overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-2 max-w-xs text-sm text-white/80">
                    {cat.description}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-accent">
                  {t("categories.shopNow")}
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
