"use client";

import { Star, Quote } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";

interface Content {
  eyebrow: string;
  title: string;
  subtitle: string;
}

const reviews = [
  { name: "Tanvir Ahmed", location: "Dhaka", rating: 5, text: "The quality of the Panjabi exceeded my expectations. The fabric is premium, the stitching is impeccable, and the fit is perfect. I have already ordered three more pieces!", product: "Premium Cotton Panjabi", initials: "TA" },
  { name: "Rakibul Hasan", location: "Chittagong", rating: 5, text: "I ordered a Sherwani for my wedding and it was absolutely stunning. The attention to detail, the embroidery, the fabric — everything was top-notch. Highly recommended!", product: "Royal Silk Sherwani", initials: "RH" },
  { name: "Imran Khan", location: "Sylhet", rating: 5, text: "Excellent customer service and fast delivery. The blazer I ordered fits perfectly and the quality is comparable to international brands at a fraction of the price.", product: "Tailored Wool Blazer", initials: "IK" },
];

export function CustomerReviewsContent({ content }: { content: Content }) {
  return (
    <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
      <Container>
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="relative flex flex-col rounded-lg border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-accent/20" />
              <div className="mb-4 flex gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {review.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.location} · Verified Purchase</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/60 pt-8 md:gap-16">
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent md:text-4xl">10,000+</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Happy Customers</div></div>
          <div className="h-12 w-px bg-border/60 hidden md:block" />
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent md:text-4xl">4.9/5</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Average Rating</div></div>
          <div className="h-12 w-px bg-border/60 hidden md:block" />
          <div className="text-center"><div className="font-serif text-3xl font-medium text-accent md:text-4xl">98%</div><div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Would Recommend</div></div>
        </div>
      </Container>
    </section>
  );
}
