import Link from "next/link";
import { Container, ButtonLink } from "@/components/layout/container";
import { Camera, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Lookbook",
  description: "Get inspired by our latest lookbook featuring curated outfits and styling ideas for every occasion.",
};

export default function LookbookPage() {
  const looks = [
    {
      id: 1,
      title: "The Classic Gentleman",
      desc: "Emerald panjabi paired with churidar pajama — perfect for Eid and festive occasions.",
      gradient: "linear-gradient(135deg, #0f5132, #1a1a1f)",
      category: "Festive",
      tag: "Editor's Pick",
    },
    {
      id: 2,
      title: "Modern Office Ready",
      desc: "Tailored charcoal blazer with white Oxford shirt — a refined business casual look.",
      gradient: "linear-gradient(135deg, #1a1a1f, #36454f)",
      category: "Formal",
      tag: "Bestseller",
    },
    {
      id: 3,
      title: "Royal Wedding",
      desc: "Ivory gold sherwani with intricate embroidery — fit for a king on his special day.",
      gradient: "linear-gradient(135deg, #f5f1e8, #b8860b)",
      category: "Wedding",
      tag: "Premium",
    },
    {
      id: 4,
      title: "Casual Weekend",
      desc: "Sand linen shirt with slim indigo jeans — effortless style for laid-back days.",
      gradient: "linear-gradient(135deg, #d2b48c, #1a237e)",
      category: "Casual",
      tag: "New",
    },
    {
      id: 5,
      title: "Winter Layers",
      desc: "Olive quilted jacket over a knit sweater — stay warm without compromising style.",
      gradient: "linear-gradient(135deg, #556b2f, #1a1a1f)",
      category: "Winter",
      tag: "Trending",
    },
    {
      id: 6,
      title: "Embroidered Elegance",
      desc: "Maroon kurta with traditional thread embroidery — celebrating Bangladeshi craftsmanship.",
      gradient: "linear-gradient(135deg, #800020, #1a1a1f)",
      category: "Ethnic",
      tag: "Featured",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-32">
        <div className="absolute inset-0">
          <div className="absolute -right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -left-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Lookbook 2026
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Curated Looks for Every Occasion
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Discover styling inspiration from our latest collection. Each look is
              thoughtfully curated to help you express your unique style.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {/* Looks grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => (
            <Link
              key={look.id}
              href="/shop"
              className="group relative aspect-[3/4] overflow-hidden rounded-lg"
              style={{ background: look.gradient }}
            >
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="absolute right-4 top-4">
                  <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                    {look.tag}
                  </span>
                </div>
                <div className="bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <p className="mb-1 text-xs uppercase tracking-wider text-white/60">
                    {look.category}
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-white">
                    {look.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/80">{look.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Shop the Look
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Camera className="h-8 w-8 text-accent" />
          </div>
          <h2 className="font-serif text-3xl font-medium">
            Share Your Style
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
            Tag us on Instagram with #RakibPanjabiHouse for a chance to be featured
            in our next lookbook.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/shop">
              Shop the Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
