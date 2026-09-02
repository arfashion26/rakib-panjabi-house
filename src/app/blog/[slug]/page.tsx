"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2, Heart, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/language-context";

const samplePosts: Record<string, any> = {
  "art-of-choosing-perfect-panjabi": {
    title: "The Art of Choosing the Perfect Panjabi",
    category: "Style Guide",
    date: "Aug 15, 2026",
    readMinutes: 5,
    gradient: "linear-gradient(135deg, #0f5132, #1a1a1f)",
    content: [
      "Choosing the right panjabi is both an art and a science. It's about understanding your body type, the occasion, the season, and most importantly, your personal style. In this comprehensive guide, we'll walk you through everything you need to know to make the perfect choice.",
      "The first consideration is fabric. Cotton panjabis are versatile and comfortable, making them ideal for everyday wear and casual occasions. Silk panjabis, on the other hand, exude luxury and are perfect for weddings, festivals, and formal events. Linen offers a breathable middle ground that works beautifully in Bangladesh's warm climate.",
      "Next, consider the fit. A well-fitted panjabi should skim your body without being too tight or too loose. The shoulder seams should align with your shoulders, and the length should fall just below the knee for a classic look. Modern slim-fit panjabis offer a more tailored silhouette for those who prefer a contemporary style.",
      "Color and pattern selection is where you can truly express your personality. Solid colors in deep jewel tones like emerald, maroon, and navy are timeless choices that work for any occasion. For festive events, consider panjabis with subtle embroidery or contrast detailing on the collar and cuffs.",
      "Finally, don't forget about care. Premium fabrics require proper maintenance to retain their beauty. Always check the care label, and when in doubt, opt for professional dry cleaning, especially for silk and embroidered pieces.",
    ],
  },
  "styling-sherwani-wedding": {
    title: "5 Ways to Style a Sherwani for Wedding Season",
    category: "Fashion Tips",
    date: "Aug 8, 2026",
    readMinutes: 4,
    gradient: "linear-gradient(135deg, #b8860b, #800020)",
    content: [
      "Wedding season in Bangladesh is a celebration of color, tradition, and style. Your sherwani is the centerpiece of your wedding look, and how you style it can make all the difference. Here are five distinct ways to style your sherwani for different wedding functions.",
      "1. The Classic Groom Look: Pair an ivory or gold sherwani with a contrasting churidar in deep maroon or navy. Add a statement brooch, a silk dupatta, and traditional mojaris to complete the regal look.",
      "2. Modern Minimalist: For the contemporary groom who prefers clean lines, choose a sherwani in a single color with subtle texture. Skip the heavy embroidery and opt for architectural details instead.",
      "3. The Festive Guest: If you're attending as a guest, a lighter sherwani in pastel shades works beautifully for daytime functions. Pair with a printed stole for added character.",
      "4. Reception Ready: For evening receptions, go bold with deep colors like midnight blue, forest green, or rich burgundy. Metallic accents in gold or silver thread work add the perfect touch of glamour.",
      "5. Mehendi Ceremony Cool: For the casual mehendi or haldi function, a short kurta-style sherwani in vibrant colors paired with churidar or even well-fitted pants makes for a stylish, comfortable choice.",
    ],
  },
  "caring-premium-ethnic-wear": {
    title: "Caring for Your Premium Ethnic Wear",
    category: "Care Guide",
    date: "Aug 1, 2026",
    readMinutes: 6,
    gradient: "linear-gradient(135deg, #1a237e, #0d1117)",
    content: [
      "Premium ethnic wear is an investment — both in terms of money and the memories attached to each piece. Proper care ensures your favorite panjabis, sherwanis, and kurtas remain beautiful for years to come.",
      "Storage is the first line of defense. Always store ethnic wear in breathable cotton garment bags, never plastic. Wooden hangers are preferable as they help maintain the garment's shape. For heavy embroidered pieces, consider folding with acid-free tissue paper between layers to prevent creasing and color transfer.",
      "When it comes to washing, always follow the care label. As a general rule, silk and embroidered pieces should be dry cleaned only. Cotton panjabis can usually be hand washed in cold water with a mild detergent. Never wring or twist wet ethnic wear — instead, gently squeeze out excess water and dry flat in shade.",
      "Ironing requires care too. Always iron ethnic wear inside out on a low to medium setting. For embroidered or printed fabrics, place a thin cotton cloth between the iron and the garment to prevent damage. Steam ironing is ideal for silk and delicate fabrics.",
      "Finally, rotate your ethnic wear. Don't wear the same piece too frequently — give each garment time to breathe and recover its shape between wears. With proper care, your premium ethnic wear can last for many celebrations to come.",
    ],
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const { t } = useLanguage();
  const slug = params.slug as string;
  const post = samplePosts[slug] || samplePosts["art-of-choosing-perfect-panjabi"];

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex min-h-[400px] items-center justify-center py-16 text-center text-white"
        style={{ background: post.gradient }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              {post.category}
            </Badge>
            <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readMinutes} {t("blog.minRead")}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-accent-text"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("blog.backToBlog")}
          </Link>

          {/* Actions */}
          <div className="mb-8 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="mr-1.5 h-3.5 w-3.5" />
              Save
            </Button>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none md:prose-base">
            {post.content.map((paragraph: string, i: number) => (
              <p key={i} className="mb-4 text-base leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Share CTA */}
          <div className="rounded-lg bg-muted/30 p-6 text-center">
            <p className="font-serif text-lg font-medium">Enjoyed this article?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Share it with your friends and explore our premium collection.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Article
              </Button>
              <Button asChild>
                <Link href="/shop">
                  Shop Collection
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
