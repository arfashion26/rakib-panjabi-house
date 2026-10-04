"use client";

import * as React from "react";
import Link from "next/link";
import { useLogoUrl } from "@/components/logo";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { siteConfig, footerNav } from "@/lib/brand";
import { useLanguage } from "@/i18n/language-context";

const socials = [
  {
    icon: Facebook,
    href: siteConfig.social.facebook,
    label: "Facebook",
    /** Brand color — applies on hover */
    hoverClass: "hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white",
    /** Static icon color (always visible) */
    iconClass: "text-[#1877F2]",
  },
  {
    icon: Instagram,
    href: siteConfig.social.instagram,
    label: "Instagram",
    hoverClass: "hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white",
    iconClass: "text-[#E4405F]",
  },
  {
    icon: Youtube,
    href: siteConfig.social.youtube,
    label: "YouTube",
    hoverClass: "hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white",
    iconClass: "text-[#FF0000]",
  },
].filter((s) => s.href);

/**
 * Premium footer — 4 columns on black bg
 */
export function SiteFooter() {
  const { t } = useLanguage();
  const logoUrl = useLogoUrl();

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand + Contact */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Al-Rakib Panjabi House - Home" className="mb-5 block">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40 md:h-20 md:w-20">
                  <img
                    src={logoUrl}
                    alt="Al-Rakib Panjabi House"
                    className="h-full w-full object-cover"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="leading-none">
                  <p className="font-serif text-lg font-semibold md:text-xl">Al-Rakib</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent md:text-xs">.com</p>
                </div>
              </div>
            </Link>
            <div className="space-y-2 text-xs text-primary-foreground/60">
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition-colors hover:text-accent">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 transition-colors hover:text-accent">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {siteConfig.phone}
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{siteConfig.address}</span>
              </p>
            </div>

            {/* Small social icons — under contact info */}
            <div className="mt-4 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`group flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/5 transition-all hover:scale-110 active:scale-95 ${social.hoverClass}`}
                  >
                    <Icon className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 group-hover:text-white ${social.iconClass}`} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-accent">
              {footerNav.shop.title}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.shop.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-accent">
              {footerNav.customer.title}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.customer.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Policies + Social */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-accent">
              {footerNav.policies.title}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.policies.links.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar — single line: copyright (left) + Cynlex logo (right) */}
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-primary-foreground/70">
              © {new Date().getFullYear()} {siteConfig.name}. {t("footer.rights")}{" "}
              <a
                href="https://cynlex.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                Managed by Cynlex Digital
              </a>
            </p>
            <a
              href="https://cynlex.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center transition-opacity hover:opacity-90"
              aria-label="Cynlex Digital"
            >
              <img
                src="https://diraphksavgifippktuh.supabase.co/storage/v1/object/public/homepage-images/general/1791118247981-t4h49bp6eo.png"
                alt="Cynlex Digital"
                className="h-5 w-auto opacity-80 transition-opacity group-hover:opacity-100"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
