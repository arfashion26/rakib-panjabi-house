"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface Content {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export function PremiumCTAContent({ content }: { content: Content }) {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-primary py-14 text-primary-foreground md:py-20 lg:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent-text">
          {t("premiumCTA.eyebrow")}
        </p>
        <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
          {t("premiumCTA.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
          {t("premiumCTA.description")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={content.primaryCtaLink}
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
          >
            {t("premiumCTA.explore")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href={content.secondaryCtaLink}
            className="inline-flex h-12 items-center justify-center rounded-md border border-primary-foreground/30 px-8 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            {t("premiumCTA.viewLookbook")}
          </Link>
        </div>
      </div>
    </section>
  );
}
