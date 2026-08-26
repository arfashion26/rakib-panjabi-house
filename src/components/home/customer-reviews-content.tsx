"use client";

import { Star, Quote } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";

import { useLanguage } from "@/i18n/language-context";
interface Content {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function CustomerReviewsContent({ content }: { content: Content }) {
  const { t } = useLanguage();

  const reviews = [
    { name: t("reviews.review1Name"), location: t("reviews.review1Location"), rating: 5, text: t("reviews.review1Text"), product: t("reviews.review1Product"), initials: "TA" },
    { name: t("reviews.review2Name"), location: t("reviews.review2Location"), rating: 5, text: t("reviews.review2Text"), product: t("reviews.review2Product"), initials: "RH" },
    { name: t("reviews.review3Name"), location: t("reviews.review3Location"), rating: 5, text: t("reviews.review3Text"), product: t("reviews.review3Product"), initials: "IK" },
  ];

  return (
    <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
      <Container>
        <SectionHeading
          eyebrow={t("reviews.eyebrow")}
          title={t("reviews.title")}
          subtitle={t("reviews.subtitle")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="relative flex flex-col rounded-lg border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-accent/20" />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {review.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.location} · {t("reviews.verifiedPurchase")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/60 pt-8 md:gap-16">
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent md:text-4xl">{t("reviews.stat1Value")}</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{t("reviews.stat1Label")}</div></div>
          <div className="h-12 w-px bg-border/60 hidden md:block" />
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent md:text-4xl">{t("reviews.stat2Value")}</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{t("reviews.stat2Label")}</div></div>
          <div className="h-12 w-px bg-border/60 hidden md:block" />
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent md:text-4xl">{t("reviews.stat3Value")}</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{t("reviews.stat3Label")}</div></div>
        </div>
      </Container>
    </section>
  );
}
