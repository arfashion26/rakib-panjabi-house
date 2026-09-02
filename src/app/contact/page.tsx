"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Send, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { siteConfig } from "@/lib/brand";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    toast.success(t("contact.successMsg"));
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
              {t("contact.heroEyebrow")}
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
              {t("contact.title")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {t("contact.subtitle")}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-serif text-2xl font-medium">{t("contact.businessHours")}</h2>
              <div className="space-y-4">
                <a
                  href="mailto:info@alrakib.com"
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-accent/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("contact.emailUs")}</p>
                    <p className="text-sm text-muted-foreground">info@alrakib.com</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("contact.emailReplyTime")}</p>
                  </div>
                </a>
                <a
                  href="tel:+8801716243949"
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-accent/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("contact.callUs")}</p>
                    <p className="text-sm text-muted-foreground">+880 1716-243949</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("contact.callTime")}</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent-text">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("contact.visitUs")}</p>
                    <p className="text-sm text-muted-foreground">Shop no- 78, Mukjoddha Super Market, 3rd Floor, Mirpur-1, Dhaka-1216</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("contact.visitStoreName")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-text" />
                <h3 className="font-serif text-lg font-medium">{t("contact.businessHours")}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("contact.satThu")}</span>
                  <span className="font-medium">{t("contact.satThuTime")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("contact.friday")}</span>
                  <span className="font-medium">{t("contact.fridayTime")}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">{t("contact.onlineSupport")}</span>
                  <span className="font-medium text-accent-text">24/7</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium">{t("footer.followUs")}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white"
                >
                  <Youtube className="h-5 w-5" />
                  <span>YouTube</span>
                </a>
              </div>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                @alrakibpunjabihouse · @Alrakibfashionhouse · @Al-RakibFashionHouse
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-lg border border-border/60 bg-card p-6 md:p-8">
            <h2 className="mb-6 font-serif text-2xl font-medium">{t("contact.sendMessage")}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.yourName")} *</Label>
                  <Input id="name" required placeholder={t("contact.yourNamePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")} *</Label>
                  <Input id="email" type="email" required placeholder={t("contact.emailPlaceholder")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("contact.phone")}</Label>
                  <Input id="phone" type="tel" placeholder={t("contact.phonePlaceholder")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t("contact.subject")} *</Label>
                  <Input id="subject" required placeholder={t("contact.subjectPlaceholder")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")} *</Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  placeholder={t("contact.messagePlaceholder")}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("contact.send")}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
