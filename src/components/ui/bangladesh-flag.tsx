"use client";

import * as React from "react";

/**
 * BangladeshFlag
 *
 * Static Bangladesh national flag (green field + red disc centered).
 * Sized via the `className` prop.
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
      >
        {/* Green field (base of the flag) */}
        <rect width="60" height="40" fill="#006a4e" />
        {/* Red disc — centered */}
        <circle cx="30" cy="20" r="11" fill="#f42a41" />
      </svg>
    </div>
  );
}
