"use client";

import { Container, SectionHeading } from "@/components/layout/container";

interface Content {
  eyebrow: string;
  title: string;
  description: string;
  description2: string;
  description3: string;
}

export function BrandStoryContent({ content }: { content: Content }) {
  const values = [
    { title: "Premium Quality", description: "Every piece is crafted with superior fabrics and meticulous attention to detail, ensuring exceptional longevity and comfort." },
    { title: "Crafted with Care", description: "Our artisans bring decades of experience, combining traditional techniques with modern design sensibilities." },
    { title: "Timeless Designs", description: "Each design balances classic elegance with contemporary style, creating pieces that transcend seasonal trends." },
    { title: "Customer First", description: "From personalized styling advice to seamless returns, we put our customers at the heart of everything we do." },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-accent/20 via-muted to-primary/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-serif text-[200px] font-light leading-none text-accent/15">RPH</div>
                  <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">Est. 2026</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-4 rounded-lg border border-accent/20" />
            <div className="absolute inset-8 rounded-lg border border-accent/10" />
            <div className="absolute -bottom-6 -right-6 rounded-lg bg-background p-5 shadow-xl">
              <div className="font-serif text-3xl font-medium text-accent">10+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Years of<br />Excellence</div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.title}
              align="left"
              className="mb-6"
            />
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-muted-foreground">{content.description}</p>
              <p className="text-base leading-relaxed text-muted-foreground">{content.description2}</p>
              <p className="text-base leading-relaxed text-muted-foreground">{content.description3}</p>
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
