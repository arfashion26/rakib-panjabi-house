import { Container, ButtonLink } from "@/components/layout/container";
import { Gift, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Gift Cards",
  description: "Give the perfect gift with Rakib Panjabi House gift cards. Available in multiple values, delivered instantly.",
};

export default function GiftCardsPage() {
  const amounts = [500, 1000, 2000, 5000, 10000];

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
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Gift className="h-8 w-8 text-accent" />
            </div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              The Perfect Gift
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Rakib Panjabi House Gift Cards
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Give the gift of premium fashion. Perfect for birthdays, weddings, Eid,
              anniversaries, or just to say you care.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Amounts */}
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium">Choose an Amount</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Gift cards are delivered via email and never expire.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {amounts.map((amount) => (
              <button
                key={amount}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-border bg-card p-4 text-center transition-all hover:border-accent"
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <Gift className="mb-2 h-6 w-6 text-accent" />
                  <p className="font-serif text-2xl font-medium">৳{amount}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Want a custom amount?{" "}
              <button className="text-accent hover:underline">
                Contact us
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Instant Delivery",
                desc: "Delivered via email within minutes of purchase.",
              },
              {
                icon: CheckCircle2,
                title: "Never Expires",
                desc: "Use it whenever you want — no pressure, no deadlines.",
              },
              {
                icon: Gift,
                title: "Personal Message",
                desc: "Add a custom note to make your gift more special.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border/60 bg-card p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-12 rounded-lg bg-muted/30 p-8">
            <h2 className="text-center font-serif text-2xl font-medium">How It Works</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Choose Amount", desc: "Select from preset amounts or customize" },
                { step: "2", title: "Add Details", desc: "Enter recipient's email and your message" },
                { step: "3", title: "Send Gift", desc: "We deliver instantly via email to them" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {item.step}
                  </div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <ButtonLink href="/shop" className="mx-auto">
              Continue Shopping
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
