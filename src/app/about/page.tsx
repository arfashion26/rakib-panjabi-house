import { Container, SectionHeading } from "@/components/layout/container";
import { Award, Heart, Sparkles, Users, Target, Eye } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Discover the story behind Rakib Panjabi House — a premium fashion brand committed to quality, craftsmanship, and timeless elegance.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Every piece is crafted with superior fabrics and meticulous attention to detail, ensuring exceptional longevity and comfort.",
    },
    {
      icon: Heart,
      title: "Crafted with Care",
      description: "Our artisans bring decades of experience, combining traditional techniques with modern design sensibilities.",
    },
    {
      icon: Sparkles,
      title: "Timeless Designs",
      description: "Each design balances classic elegance with contemporary style, creating pieces that transcend seasonal trends.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "From personalized styling advice to seamless returns, we put our customers at the heart of everything we do.",
    },
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
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Our Story
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
              A Legacy of Craftsmanship
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Rakib Panjabi House was founded with a singular vision — to bring premium
              quality ethnic and contemporary fashion to the modern Bangladeshi gentleman.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-serif text-3xl font-medium tracking-tight">
            From Humble Beginnings
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            What started as a small workshop in the heart of Dhaka has grown into a trusted
            destination for discerning customers who appreciate the finer details. Our journey
            began with a simple belief: that traditional Bangladeshi craftsmanship deserves to
            be celebrated, preserved, and shared with the world.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Each piece in our collection is a testament to our commitment to quality, from
            the carefully sourced fabrics to the final stitches applied by our skilled artisans.
            We work directly with weavers, dyers, and embroiderers across Bangladesh, ensuring
            fair wages and preserving age-old techniques that might otherwise be lost.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Today, Rakib Panjabi House serves thousands of customers across Bangladesh and
            beyond. But our mission remains the same: to create clothing that makes you feel
            confident, comfortable, and connected to your cultural heritage.
          </p>
        </div>
      </Container>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-medium">Our Mission</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                To deliver premium quality ethnic and contemporary menswear that celebrates
                Bangladeshi craftsmanship while meeting the needs of the modern customer. We
                strive to make every purchase a delightful experience — from browsing to
                unboxing.
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-background p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-medium">Our Vision</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                To become Bangladesh&apos;s most loved premium fashion brand, recognized
                internationally for quality, design, and ethical business practices. We
                envision a future where traditional craftsmanship thrives alongside modern
                fashion sensibilities.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <Container className="py-16 md:py-24">
        <SectionHeading
          eyebrow="What We Stand For"
          title="Our Core Values"
          subtitle="The principles that guide every decision we make, from design to delivery."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-border/60 bg-card p-6 transition-colors hover:border-accent/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
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
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Premium Products" },
              { value: "4.9★", label: "Customer Rating" },
              { value: "50+", label: "Skilled Artisans" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-4xl font-medium text-accent md:text-5xl">
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
