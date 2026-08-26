"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Container, ButtonLink } from "@/components/layout/container";
import { Gift, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function GiftCardsPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = React.useState<number>(1000);
  const [customAmount, setCustomAmount] = React.useState<string>("");
  const [useCustom, setUseCustom] = React.useState(false);
  const [recipientName, setRecipientName] = React.useState("");
  const [recipientEmail, setRecipientEmail] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const finalAmount = useCustom
    ? Math.max(100, Math.min(50000, parseInt(customAmount || "0", 10) || 0))
    : selectedAmount;

  function handleBuy() {
    // Validate
    if (!finalAmount || finalAmount < 100) {
      toast.error(
        t("giftCards.title") + ": minimum amount is ৳100"
      );
      return;
    }
    if (!recipientName.trim()) {
      toast.error("Please enter recipient name");
      return;
    }
    if (!recipientEmail.trim() || !recipientEmail.includes("@")) {
      toast.error("Please enter a valid recipient email");
      return;
    }

    setSubmitting(true);

    // Store gift card details in sessionStorage — checkout will read them
    const giftCardOrder = {
      type: "gift_card",
      amount: finalAmount,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      senderName: senderName.trim() || "Anonymous",
      message: message.trim(),
    };
    sessionStorage.setItem("giftCardOrder", JSON.stringify(giftCardOrder));

    // Redirect to checkout
    setTimeout(() => {
      router.push("/checkout");
    }, 300);
  }

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
              {t("giftCards.title")}
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {t("giftCards.title")}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              {t("giftCards.subtitle")}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Step 1: Amounts */}
          <div className="text-center">
            <h2 className="font-serif text-3xl font-medium">
              {t("giftCards.amounts")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("giftCards.termsNote")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {AMOUNTS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setUseCustom(false);
                }}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-card p-4 text-center transition-all hover:border-accent",
                  !useCustom && selectedAmount === amount
                    ? "border-accent bg-accent/5"
                    : "border-border"
                )}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <Gift className="mb-2 h-6 w-6 text-accent" />
                  <p className="font-serif text-2xl font-medium">৳{amount}</p>
                </div>
                {!useCustom && selectedAmount === amount && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {t("giftCards.custom")}
            </label>
            {useCustom && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">৳</span>
                <input
                  type="number"
                  min={100}
                  max={50000}
                  step={100}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="2000"
                  className="w-24 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                />
              </div>
            )}
          </div>

          {/* Step 2: Recipient form */}
          <div className="mt-12 rounded-lg border border-border/60 bg-card p-6">
            <h2 className="font-serif text-2xl font-medium">
              {t("giftCards.recipient")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("giftCards.recipientName")} *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("giftCards.recipientEmail")} *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {locale === "bn" ? "আপনার নাম (প্রেষক)" : "Your Name (Sender)"}
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={locale === "bn" ? "ঐচ্ছিক" : "Optional"}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("giftCards.message")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={
                  locale === "bn"
                    ? "আপনার শুভেচ্ছা লিখুন..."
                    : "Write your wishes..."
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Summary + Buy button */}
            <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {locale === "bn" ? "মোট" : "Total"}
                </p>
                <p className="font-serif text-3xl font-medium text-accent">
                  ৳{finalAmount.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={handleBuy}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                    {locale === "bn" ? "প্রসেসিং..." : "Processing..."}
                  </>
                ) : (
                  <>
                    {t("giftCards.buyNow")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: locale === "bn" ? "তাৎক্ষণিক ডেলিভারি" : "Instant Delivery",
                desc:
                  locale === "bn"
                    ? "কেনার কয়েক মিনিটের মধ্যে ইমেইলে পাঠানো হয়।"
                    : "Delivered via email within minutes of purchase.",
              },
              {
                icon: CheckCircle2,
                title: locale === "bn" ? "মেয়াদ শেষ হয় না" : "Never Expires",
                desc:
                  locale === "bn"
                    ? "যখন খুশি ব্যবহার করুন — কোনো চাপ নেই।"
                    : "Use it whenever you want — no pressure, no deadlines.",
              },
              {
                icon: Gift,
                title: locale === "bn" ? "ব্যক্তিগত মেসেজ" : "Personal Message",
                desc:
                  locale === "bn"
                    ? "আপনার উপহারকে আরও বিশেষ করতে কাস্টম নোট যোগ করুন।"
                    : "Add a custom note to make your gift more special.",
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

          {/* CTA */}
          <div className="mt-12 text-center">
            <ButtonLink href="/shop" className="mx-auto">
              {t("common.continue")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
