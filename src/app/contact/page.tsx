"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
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
    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
              We&apos;d Love to Hear from You
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Have a question about our products, your order, or just want to say hello?
              Our team is here to help.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-serif text-2xl font-medium">Contact Information</h2>
              <div className="space-y-4">
                <a
                  href="mailto:info@alrakib.com"
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-accent/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("contact.emailUs")}</p>
                    <p className="text-sm text-muted-foreground">info@alrakib.com</p>
                    <p className="mt-1 text-xs text-muted-foreground">We reply within 24 hours</p>
                  </div>
                </a>
                <a
                  href="tel:+8801716243949"
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-accent/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("contact.callUs")}</p>
                    <p className="text-sm text-muted-foreground">+880 1716-243949</p>
                    <p className="mt-1 text-xs text-muted-foreground">Sat–Thu, 10AM–8PM</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("contact.visitUs")}</p>
                    <p className="text-sm text-muted-foreground">Shop no- 78, Mukjoddha Super Market, 3rd Floor, Mirpur-1, Dhaka-1216</p>
                    <p className="mt-1 text-xs text-muted-foreground">Our flagship store</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-serif text-lg font-medium">{t("contact.businessHours")}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday – Thursday</span>
                  <span className="font-medium">10:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Friday</span>
                  <span className="font-medium">3:00 PM – 8:00 PM</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Online Support</span>
                  <span className="font-medium text-accent">24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-lg border border-border/60 bg-card p-6 md:p-8">
            <h2 className="mb-6 font-serif text-2xl font-medium">{t("contact.sendMessage")}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" required placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required placeholder="you@example.com" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+880 1716-243949" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" required placeholder="How can we help?" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
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
