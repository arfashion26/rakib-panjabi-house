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
    <section className="bg-accent py-14 md:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-primary/10">
              {content.image ? (
                <img
                  src={content.image}
                  alt={t("brandStory.title")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-serif text-[200px] font-light leading-none text-accent-foreground/15">RPH</div>
                    <p className="mt-4 text-sm uppercase tracking-[0.3em] text-accent-foreground/50">Est. 2026</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute inset-4 rounded-lg border border-accent-foreground/15" />
            <div className="absolute inset-8 rounded-lg border border-accent-foreground/10" />
            <div className="absolute -bottom-6 -right-6 rounded-lg bg-background p-5 shadow-xl">
              <div className="font-serif text-3xl font-medium text-accent">10+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("brandStory.yearsLabel").replace(" ", "<br />") }} />
            </div>
          </div>

          <div>
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/60">{t("brandStory.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-accent-foreground md:text-4xl lg:text-5xl">{t("brandStory.title")}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-accent-foreground/75">{t("brandStory.desc1")}</p>
              <p className="text-base leading-relaxed text-accent-foreground/75">{t("brandStory.desc2")}</p>
              <p className="text-base leading-relaxed text-accent-foreground/75">{t("brandStory.desc3")}</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="rounded-lg border border-accent-foreground/15 bg-accent-foreground/5 p-4 transition-colors hover:border-accent-foreground/30 hover:bg-accent-foreground/10">
                  <h3 className="text-sm font-semibold text-accent-foreground">{value.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-accent-foreground/65">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
