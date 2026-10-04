"use client";

import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  /** Icon + circle background color — each badge gets a distinct brand color */
  color: string;
}

const badges: Badge[] = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over ৳2000",
    color: "from-orange-400 to-amber-500",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    subtitle: "7-day return policy",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% protected",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Dedicated assistance",
    color: "from-purple-400 to-fuchsia-500",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-primary py-6 text-primary-foreground md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="group flex items-center gap-3 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-all duration-300 hover:border-primary-foreground/20 hover:bg-primary-foreground/10 md:gap-4 md:p-4"
              >
                {/* Icon — gradient background, white icon. Each badge has its
                    own brand color so they're distinguishable at a glance. */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-14 md:w-14`}
                >
                  <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wide text-primary-foreground md:text-sm">
                    {badge.title}
                  </div>
                  <div className="text-[10px] text-primary-foreground/60 md:text-xs">
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
