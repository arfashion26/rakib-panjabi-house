"use client";

import { Container, SectionHeading } from "@/components/layout/container";
import { Award, Heart, Sparkles, Users, Target, Eye } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { usePageContent, pickContent } from "@/lib/hooks/use-page-content";

export default function AboutPage() {
  const { t } = useLanguage();
  const { content } = usePageContent("about");

  // Use edited content if available, otherwise fall back to translation keys
  const heroEyebrow = pickContent(content?.heroEyebrow, t("about.eyebrow"));
  const heroTitle = pickContent(content?.heroTitle, t("about.title"));
  const heroDesc = pickContent(content?.heroDescription, t("about.heroDesc"));

  const values = [
    { icon: Award, title: t("about.premiumQuality"), description: t("about.premiumQualityDesc") },
    { icon: Heart, title: t("about.craftedCare"), description: t("about.craftedCareDesc") },
    { icon: Sparkles, title: t("about.timelessDesigns"), description: t("about.timelessDesignsDesc") },
    { icon: Users, title: t("about.customerFirst"), description: t("about.customerFirstDesc") },
  ];

  const stats = [
    { value: t("about.stat1Value"), label: t("about.stat1Label") },
    { value: t("about.stat2Value"), label: t("about.stat2Label") },
    { value: t("about.stat3Value"), label: t("about.stat3Label") },
    { value: t("about.stat4Value"), label: t("about.stat4Label") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-32">
        <div className="absolute inset-0">
          <div className="absolute -right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent-text">
              {heroEyebrow}
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              {heroDesc}
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-serif text-3xl font-medium tracking-tight">
            {t("about.storyTitle")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("about.storyDesc1")}
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("about.storyDesc2")}
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("about.storyDesc3")}
          </p>
        </div>
      </Container>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-medium">{t("about.missionTitle")}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t("about.missionDesc")}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-medium">{t("about.visionTitle")}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t("about.visionDesc")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <Container className="py-16 md:py-24">
        <SectionHeading
          eyebrow={t("about.valuesEyebrow")}
          title={t("about.coreValues")}
          subtitle={t("about.valuesSubtitle")}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-border/60 bg-card p-6 transition-colors hover:border-accent/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold">{value.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* Stats */}
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl font-medium text-accent-text md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider text-primary-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
