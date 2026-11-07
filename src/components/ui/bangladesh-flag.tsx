"use client";

import * as React from "react";

/**
 * BangladeshFlag
 *
 * Animated Bangladesh national flag (green field + red disc) that gently
 * waves as if blown by the wind. Sized via the `className` prop.
 *
 * Used in the desktop header next to the search bar.
 */
export function BangladeshFlag({ className }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="Bangladesh flag"
      title="Bangladesh"
    >
      <svg
        viewBox="0 0 60 40"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        style={{
          animation: "bdflag-wave 2.4s ease-in-out infinite",
          transformOrigin: "left center",
        }}
      >
        {/* Green field (base of the flag) */}
        <rect width="60" height="40" fill="#006a4e" />
        {/* Red disc — slightly off-center toward the hoist (left side) */}
        <circle cx="24" cy="20" r="11" fill="#f42a41" />
      </svg>
      <style>{`
        @keyframes bdflag-wave {
          0%, 100% {
            transform: perspective(140px) rotateY(-6deg) skewY(-1.5deg);
          }
          50% {
            transform: perspective(140px) rotateY(6deg) skewY(1.5deg);
          }
        }
      `}</style>
    </div>
  );
}
