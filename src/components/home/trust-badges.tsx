"use client";

import * as React from "react";
import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  /** Solid + gradient circle colors — each badge gets its own brand color */
  iconBg: string;
  /** Subtle wash behind the icon for premium depth */
  iconGlow: string;
  /** Card top border accent on hover */
  accent: string;
}

const badges: Badge[] = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over ৳2000",
    iconBg: "from-orange-400 to-amber-500",
    iconGlow: "bg-orange-500/20",
    accent: "bg-orange-400",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    subtitle: "7-day return policy",
    iconBg: "from-emerald-400 to-teal-500",
    iconGlow: "bg-emerald-500/20",
    accent: "bg-emerald-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% protected",
    iconBg: "from-blue-400 to-indigo-500",
    iconGlow: "bg-blue-500/20",
    accent: "bg-blue-400",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Dedicated assistance",
    iconBg: "from-purple-400 to-fuchsia-500",
    iconGlow: "bg-purple-500/20",
    accent: "bg-purple-400",
  },
];

export function TrustBadges() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Decorative gradient wash — adds depth to the dark background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(212,175,55,0.08), transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,111,71,0.10), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-foreground/25 hover:bg-primary-foreground/[0.08] hover:shadow-2xl hover:shadow-black/30 sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:text-left lg:p-6"
              >
                {/* Top accent bar — animates in on hover */}
                <span
                  className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 ${badge.accent} transition-transform duration-300 group-hover:scale-x-100`}
                  aria-hidden="true"
                />

                {/* Icon — gradient background, white icon, soft glow halo */}
                <div className="relative shrink-0">
                  {/* Soft colored glow behind the icon */}
                  <div
                    className={`absolute inset-0 ${badge.iconGlow} blur-xl transition-opacity duration-300 group-hover:opacity-100`}
                    aria-hidden="true"
                  />
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${badge.iconBg} shadow-lg ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]`}
                  >
                    <Icon className="h-6 w-6 text-white drop-shadow-sm sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                  </div>
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <div className="text-sm font-bold uppercase tracking-wide text-primary-foreground sm:text-base lg:text-lg">
                    {badge.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-primary-foreground/55 sm:text-xs lg:text-sm">
                    {badge.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
