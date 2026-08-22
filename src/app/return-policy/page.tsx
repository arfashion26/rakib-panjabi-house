import { Container } from "@/components/layout/container";
import { CheckCircle2, XCircle, RefreshCw, Truck, CreditCard } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy",
  description: "Learn about our 7-day return policy and refund process at Rakib Panjabi House.",
};

export default function ReturnPolicyPage() {
  const returnable = [
    "Items must be unworn, unwashed, and unused",
    "Original tags and packaging must be intact",
    "All original accessories included",
    "Return request within 7 days of delivery",
  ];

  const nonReturnable = [
    "Undergarments and swimwear",
    "Personalized or custom-made products",
    "Items damaged due to misuse",
    "Sale or clearance items (final sale)",
  ];

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Last Updated: August 2026
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Return &amp; Refund Policy
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Your satisfaction is our priority. If you&apos;re not completely happy with your
          purchase, we&apos;re here to help with returns and refunds.
        </p>

        {/* Quick summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <RefreshCw className="mx-auto mb-2 h-8 w-8 text-accent" />
            <p className="font-serif text-2xl font-medium">7 Days</p>
            <p className="text-xs text-muted-foreground">Return window</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <CreditCard className="mx-auto mb-2 h-8 w-8 text-accent" />
            <p className="font-serif text-2xl font-medium">3-5 Days</p>
            <p className="text-xs text-muted-foreground">Refund processing</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4 text-center">
            <Truck className="mx-auto mb-2 h-8 w-8 text-accent" />
            <p className="font-serif text-2xl font-medium">Free</p>
            <p className="text-xs text-muted-foreground">Return shipping*</p>
          </div>
        </div>

        <div className="mt-12 space-y-10">
          {/* Eligibility */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Return Eligibility</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Returnable Items
                </h3>
                <ul className="space-y-2">
                  {returnable.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700">
                  <XCircle className="h-4 w-4" />
                  Non-Returnable Items
                </h3>
                <ul className="space-y-2">
                  {nonReturnable.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* How to return */}
          <div>
            <h2 className="font-serif text-2xl font-medium">How to Initiate a Return</h2>
            <ol className="mt-4 space-y-4">
              {[
                {
                  step: 1,
                  title: "Submit a Return Request",
                  desc: "Log in to your dashboard, go to My Orders, find the order, and click 'Request Return'. Alternatively, contact our support team with your order number.",
                },
                {
                  step: 2,
                  title: "Get Approval",
                  desc: "We'll review your request within 24 hours and send you return instructions, including the return address and courier details.",
                },
                {
                  step: 3,
                  title: "Pack the Item",
                  desc: "Pack the item securely in its original packaging with all tags and accessories. Include a copy of your order invoice.",
                },
                {
                  step: 4,
                  title: "Ship It Back",
                  desc: "Use our courier partner or any reliable courier service to ship the item back. Keep the tracking number for reference.",
                },
                {
                  step: 5,
                  title: "Receive Refund",
                  desc: "Once we receive and inspect the item, we'll process your refund within 3-5 business days to your original payment method.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Refund methods */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Refund Methods</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <h3 className="text-sm font-medium">bKash / Nagad / Rocket</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Refund processed to your mobile wallet within 3-5 business days.
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <h3 className="text-sm font-medium">Bank Card (Visa/Mastercard)</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Refund processed to your original card within 7-10 business days (bank processing time may vary).
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-4">
                <h3 className="text-sm font-medium">Store Credit</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get instant store credit with an additional 5% bonus, valid for 6 months.
                </p>
              </div>
            </div>
          </div>

          {/* Damaged/defective */}
          <div className="rounded-lg bg-muted/30 p-6">
            <h2 className="font-serif text-2xl font-medium">Damaged or Defective Items</h2>
            <p className="mt-3 text-base text-muted-foreground">
              If you receive a damaged or defective item, please contact us within 48 hours
              of delivery with photos of the damage. We&apos;ll arrange a free replacement or
              full refund at no cost to you.
            </p>
          </div>

          {/* Exchange */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Size Exchanges</h2>
            <p className="mt-3 text-base text-muted-foreground">
              We offer free size exchanges within the 7-day return window. If the size you
              want is out of stock, we&apos;ll issue a full refund or offer store credit with
              a 5% bonus.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-lg bg-primary p-6 text-center text-primary-foreground">
            <h2 className="font-serif text-xl font-medium">Need Help?</h2>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Our support team is ready to assist with any return or refund questions.
            </p>
            <p className="mt-3 text-sm font-medium">
              Email: support@rakibpanjabihouse.com · Phone: +880 1XXX-XXXXXX
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
