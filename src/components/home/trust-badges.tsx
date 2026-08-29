"use client";

import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  { icon: Truck, title: "Free Shipping", subtitle: "On orders over ৳2000" },
  { icon: RefreshCw, title: "Easy Returns", subtitle: "7-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", subtitle: "100% protected" },
  { icon: Headphones, title: "24/7 Support", subtitle: "Dedicated assistance" },
];

export function TrustBadges() {
  return (
    <section className="bg-primary py-6 text-primary-foreground md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {badges.map((badge, idx) => (
            <div
              key={badge.title}
              className="group flex items-center gap-3 md:gap-4"
            >
              {/* Icon circle */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 transition-all group-hover:scale-110 group-hover:border-accent/50 md:h-12 md:w-12">
                <badge.icon className="h-4 w-4 text-accent md:h-5 md:w-5" />
              </div>
              {/* Text */}
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wide text-primary-foreground md:text-sm">
                  {badge.title}
                </div>
                <div className="text-[10px] text-primary-foreground/50 md:text-xs">
                  {badge.subtitle}
                </div>
              </div>
              {/* Divider — between items, not after last */}
              {idx < badges.length - 1 && (
                <div className="ml-auto hidden h-10 w-px bg-primary-foreground/10 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
