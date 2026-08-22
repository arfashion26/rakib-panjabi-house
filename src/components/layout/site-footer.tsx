"use client";

import * as React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { siteConfig, footerNav, paymentMethods } from "@/lib/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Trust badges row (shipping, returns, support, secure)
 */
function TrustBadges() {
  const badges = [
    { icon: Truck, title: "Free Shipping", subtitle: "On orders over ৳2000" },
    { icon: RefreshCw, title: "Easy Returns", subtitle: "7-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% protected" },
    { icon: Headphones, title: "24/7 Support", subtitle: "Dedicated assistance" },
  ];
  return (
    <div className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <badge.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{badge.title}</div>
                <div className="text-xs text-muted-foreground">{badge.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Newsletter subscription
 */
function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="border-b border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-medium md:text-3xl">
            Join Our Exclusive Circle
          </h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Subscribe to receive early access to new collections, private sales, and
            style inspiration straight to your inbox.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-11 border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </form>
          {submitted && (
            <p className="mt-3 text-sm text-accent">
              ✓ Thank you for subscribing! Check your inbox for a welcome message.
            </p>
          )}
          <p className="mt-3 text-xs text-primary-foreground/60">
            By subscribing, you agree to our Privacy Policy and consent to receive
            updates from Rakib Panjabi House.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Footer link column
 */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Main footer
 */
export function SiteFooter() {
  const socials = [
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
    { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto bg-background">
      <TrustBadges />
      <Newsletter />

      {/* Main footer */}
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {/* Brand + contact */}
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" aria-label="Rakib Panjabi House - Home">
                <Logo size="md" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {siteConfig.description}
              </p>

              {/* Contact info */}
              <div className="mt-6 space-y-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                >
                  <Mail className="h-4 w-4" />
                  {siteConfig.email}
                </a>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                >
                  <Phone className="h-4 w-4" />
                  {siteConfig.phone}
                </a>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {siteConfig.address}
                </p>
              </div>

              {/* Social */}
              {socials.length > 0 && (
                <div className="mt-6 flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer link columns */}
            <FooterColumn
              title={footerNav.shop.title}
              links={footerNav.shop.links}
            />
            <FooterColumn
              title={footerNav.categories.title}
              links={footerNav.categories.links}
            />
            <FooterColumn
              title={footerNav.customer.title}
              links={footerNav.customer.links}
            />
            <FooterColumn
              title={footerNav.policies.title}
              links={footerNav.policies.links}
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
              Crafted with care in Bangladesh.
            </p>

            {/* Payment methods */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="rounded border border-border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground"
                  title={method.name}
                >
                  {method.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
