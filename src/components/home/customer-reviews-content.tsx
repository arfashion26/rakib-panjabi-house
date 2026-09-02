"use client";

import * as React from "react";
import { Star, Quote } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

interface Content {
  eyebrow: string;
  title: string;
  subtitle: string;
}

interface DbReview {
  id: string;
  customer_name: string;
  customer_location: string;
  product_name: string;
  rating: number;
  review_text: string;
}

export function CustomerReviewsContent({ content }: { content: Content }) {
  const { t } = useLanguage();
  const [dbReviews, setDbReviews] = React.useState<DbReview[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/homepage-reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.reviews?.length > 0) {
          setDbReviews(data.reviews);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fallback static reviews (used when DB has no reviews or is unreachable)
  const fallbackReviews: DbReview[] = [
    { id: "fallback-1", customer_name: t("reviews.review1Name"), customer_location: t("reviews.review1Location"), product_name: t("reviews.review1Product"), rating: 5, review_text: t("reviews.review1Text") },
    { id: "fallback-2", customer_name: t("reviews.review2Name"), customer_location: t("reviews.review2Location"), product_name: t("reviews.review2Product"), rating: 5, review_text: t("reviews.review2Text") },
    { id: "fallback-3", customer_name: t("reviews.review3Name"), customer_location: t("reviews.review3Location"), product_name: t("reviews.review3Product"), rating: 5, review_text: t("reviews.review3Text") },
  ];

  // Use DB reviews if available, otherwise fallback
  const reviews = dbReviews.length > 0 ? dbReviews : fallbackReviews;

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <section className="bg-primary py-14 text-primary-foreground md:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("reviews.eyebrow")}
          title={t("reviews.title")}
          subtitle={t("reviews.subtitle")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div key={review.id || idx} className="relative flex flex-col rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-primary-foreground/10">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-accent-text/20" />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent-text" />
                ))}
              </div>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-primary-foreground/90">
                &ldquo;{review.review_text}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-primary-foreground/15 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent-text">
                  {getInitials(review.customer_name)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">
                    {review.customer_name}
                  </div>
                  <div className="text-xs text-primary-foreground/60">
                    {review.customer_location}
                    {review.product_name ? ` · ${review.product_name}` : ""} · {t("reviews.verifiedPurchase")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-primary-foreground/15 pt-8 md:gap-16">
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent-text md:text-4xl">{t("reviews.stat1Value")}</div><div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/50">{t("reviews.stat1Label")}</div></div>
          <div className="h-12 w-px bg-primary-foreground/15 hidden md:block" />
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent-text md:text-4xl">{t("reviews.stat2Value")}</div><div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/50">{t("reviews.stat2Label")}</div></div>
          <div className="h-12 w-px bg-primary-foreground/15 hidden md:block" />
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent-text md:text-4xl">{t("reviews.stat3Value")}</div><div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/50">{t("reviews.stat3Label")}</div></div>
        </div>
      </Container>
    </section>
  );
}
