"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

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
}

interface Announcement {
  text: string;
  enabled: boolean;
}

export function HeroBannerContent({ content, announcement }: { content: HeroContent; announcement: Announcement }) {
  return (
    <>
      {/* Announcement bar */}
      {announcement.enabled && (
        <div className="bg-accent text-accent-foreground">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-9 items-center justify-center text-center text-xs">
              <span className="font-medium tracking-wide">{announcement.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
          <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -left-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[600px] items-center py-16 md:py-24 lg:grid-cols-2 lg:gap-12 lg:py-32">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-accent">
                <Sparkles className="h-3 w-3" />
                {content.eyebrow}
              </div>

              <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                {content.title}
                <br />
                <span className="italic text-accent">{content.titleAccent}</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg lg:mx-0">
                {content.description}
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href={content.primaryCtaLink}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md bg-accent px-6 text-sm font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 sm:w-auto"
                >
                  {content.primaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href={content.secondaryCtaLink}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md border border-primary-foreground/30 px-6 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:w-auto"
                >
                  {content.secondaryCtaText}
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-primary-foreground/10 pt-6 lg:max-w-md">
                <div>
                  <div className="font-serif text-2xl font-medium text-accent md:text-3xl">
                    {content.stat1Value}
                  </div>
                  <div className="mt-1 text-xs text-primary-foreground/60">
                    {content.stat1Label}
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-medium text-accent md:text-3xl">
                    {content.stat2Value}
                  </div>
                  <div className="mt-1 text-xs text-primary-foreground/60">
                    {content.stat2Label}
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-medium text-accent md:text-3xl">
                    {content.stat3Value}
                  </div>
                  <div className="mt-1 text-xs text-primary-foreground/60">
                    {content.stat3Label}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-serif text-9xl font-light text-accent/30">RPH</div>
                    <p className="mt-4 text-sm uppercase tracking-[0.3em] text-primary-foreground/40">
                      Premium Fashion
                    </p>
                  </div>
                </div>
                <div className="absolute inset-4 border border-accent/20 rounded" />
                <div className="absolute inset-6 border border-accent/10 rounded" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-lg bg-background p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Handcrafted</div>
                    <div className="text-xs text-muted-foreground">Premium quality</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      </section>
    </>
  );
}
