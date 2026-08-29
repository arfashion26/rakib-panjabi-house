"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface HeroContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  image: string;
  badgeText: string;
}

interface Announcement {
  text: string;
  enabled: boolean;
}

export function HeroBannerContent({ content, announcement }: { content: HeroContent; announcement: Announcement }) {
  const { locale, t } = useLanguage();
  const eyebrow = locale === "bn" ? t("hero.eyebrow") : content.eyebrow;
  const title = locale === "bn" ? t("hero.title") : content.title;
  const titleAccent = locale === "bn" ? t("hero.titleAccent") : content.titleAccent;
  const description = locale === "bn" ? t("hero.description") : content.description;
  const primaryCtaText = locale === "bn" ? t("hero.exploreCollection") : content.primaryCtaText;
  const secondaryCtaText = locale === "bn" ? t("hero.newArrivals") : content.secondaryCtaText;
  const stat1Value = locale === "bn" ? t("hero.stat1Value") : content.stat1Value;
  const stat1Label = locale === "bn" ? t("hero.stat1Label") : content.stat1Label;
  const stat2Value = locale === "bn" ? t("hero.stat2Value") : content.stat2Value;
  const stat2Label = locale === "bn" ? t("hero.stat2Label") : content.stat2Label;
  const stat3Value = locale === "bn" ? t("hero.stat3Value") : content.stat3Value;
  const stat3Label = locale === "bn" ? t("hero.stat3Label") : content.stat3Label;

  // Use admin-uploaded image (from DB homepage content)
  const heroImage = content.image;

  // Note: Announcement bar is rendered by SiteHeader (single source)
  // The 'announcement' prop is accepted for API compatibility but not rendered here.

  return (
    <>
      {/* Hero section — full-bleed image with gradient overlay */}
      <section className="relative min-h-[600px] overflow-hidden bg-primary md:min-h-[680px] lg:min-h-[760px]">
        {/* Background image */}
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Premium Panjabi Collection"
              className="h-full w-full object-cover object-center"
            />
          </div>
        )}

        {/* Gradient overlay — dark on left for text readability, transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/30 md:from-primary/95 md:via-primary/70 md:to-transparent" />

        {/* Subtle bottom gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-4 sm:px-6 lg:min-h-[760px] lg:px-8">
          <div className="max-w-2xl py-16 md:py-20 lg:py-28">
            {/* Eyebrow badge */}
            <div className="mb-5 inline-flex animate-[fadeIn_0.6s_ease-out] items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-accent">
                {eyebrow}
              </span>
            </div>

            {/* Title */}
            <h1 className="animate-[fadeIn_0.7s_ease-out] font-serif text-4xl font-medium leading-[1.05] tracking-tight text-primary-foreground md:text-5xl lg:text-6xl xl:text-7xl">
              {title}
              <br />
              <span className="italic text-accent">{titleAccent}</span>
            </h1>

            {/* Description */}
            <p className="animate-[fadeIn_0.8s_ease-out] mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/75 md:text-base lg:text-lg">
              {description}
            </p>

            {/* CTA buttons */}
            <div className="animate-[fadeIn_0.9s_ease-out] mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={content.primaryCtaLink}
                className="group inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-sm font-semibold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-accent/30 active:scale-[0.98]"
              >
                {primaryCtaText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={content.secondaryCtaLink}
                className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-7 text-sm font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/15 hover:border-primary-foreground/50 active:scale-[0.98]"
              >
                {secondaryCtaText}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="animate-[fadeIn_1s_ease-out] mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-xs text-primary-foreground/70">
                  {stat3Value} / 5 · {stat1Value} {locale === "bn" ? "সন্তুষ্ট গ্রাহক" : "happy customers"}
                </span>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="text-xs text-primary-foreground/70">
                  {locale === "bn" ? "নিরাপদ পেমেন্ট" : "Secure Payment"}
                </span>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <RefreshCw className="h-4 w-4 text-accent" />
                <span className="text-xs text-primary-foreground/70">
                  {locale === "bn" ? "৭ দিনের রিটার্ন" : "7-Day Returns"}
                </span>
              </div>
            </div>

            {/* Stats bar */}
            <div className="animate-[fadeIn_1.1s_ease-out] mt-10 flex items-center gap-6 border-t border-primary-foreground/15 pt-6 lg:gap-10">
              <div>
                <div className="font-serif text-xl font-medium text-accent md:text-2xl">
                  {stat1Value}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-primary-foreground/50">
                  {stat1Label}
                </div>
              </div>
              <div className="h-8 w-px bg-primary-foreground/15" />
              <div>
                <div className="font-serif text-xl font-medium text-accent md:text-2xl">
                  {stat2Value}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-primary-foreground/50">
                  {stat2Label}
                </div>
              </div>
              <div className="h-8 w-px bg-primary-foreground/15" />
              <div>
                <div className="font-serif text-xl font-medium text-accent md:text-2xl">
                  {stat3Value}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-primary-foreground/50">
                  {stat3Label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/40">
              {locale === "bn" ? "স্ক্রল করুন" : "Scroll"}
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-primary-foreground/40 to-transparent" />
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </section>
    </>
  );
}
