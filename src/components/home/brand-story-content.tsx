"use client";

import { Container, SectionHeading } from "@/components/layout/container";

import { useLanguage } from "@/i18n/language-context";
interface Content {
  eyebrow: string;
  title: string;
  description: string;
  description2: string;
  description3: string;
  image: string;
}

export function BrandStoryContent({ content }: { content: Content }) {
  const { t } = useLanguage();
  const values = [
    { title: t("brandStory.value1Title"), description: t("brandStory.value1Desc") },
    { title: t("brandStory.value2Title"), description: t("brandStory.value2Desc") },
    { title: t("brandStory.value3Title"), description: t("brandStory.value3Desc") },
    { title: t("brandStory.value4Title"), description: t("brandStory.value4Desc") },
  ];

  return (
    <section className="bg-background py-14 md:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-accent/20 via-muted to-primary/5">
              {content.image ? (
                <img
                  src={content.image}
                  alt={t("brandStory.title")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-serif text-[200px] font-light leading-none text-accent/15">RPH</div>
                    <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">Est. 2026</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute inset-4 rounded-lg border border-accent/20" />
            <div className="absolute inset-8 rounded-lg border border-accent/10" />
            <div className="absolute -bottom-6 -right-6 rounded-lg bg-background p-5 shadow-xl">
              <div className="font-serif text-3xl font-medium text-accent">10+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("brandStory.yearsLabel").replace(" ", "<br />") }} />
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={t("brandStory.eyebrow")}
              title={t("brandStory.title")}
              align="left"
              className="mb-6"
            />
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted-foreground">{t("brandStory.desc1")}</p>
              <p className="text-base leading-relaxed text-muted-foreground">{t("brandStory.desc2")}</p>
              <p className="text-base leading-relaxed text-muted-foreground">{t("brandStory.desc3")}</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-accent/40">
                  <h3 className="text-sm font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
