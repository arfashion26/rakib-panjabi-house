"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  containerClassName?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
}

/**
 * Centered max-width container with responsive padding
 */
export function Container({
  as: Component = "div",
  size = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1440px]",
    full: "max-w-none",
  };

  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Section wrapper with vertical padding and optional background
 */
export function Section({
  as: Component = "section",
  className,
  containerClassName,
  containerSize = "lg",
  children,
  ...props
}: SectionProps) {
  return (
    <Component className={cn("py-12 md:py-16 lg:py-20", className)} {...props}>
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </Component>
  );
}

/**
 * Section heading with eyebrow + title + subtitle
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-12",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Button-like link
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent",
    ghost: "hover:bg-accent/10",
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
