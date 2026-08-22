import { cn } from "@/lib/utils";
import Image from "next/image";
import { siteConfig } from "@/lib/brand";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Brand logo component.
 *
 * Currently uses a typographic logo (text-based) since the user will
 * provide the brand image later. When an SVG/PNG logo file is placed
 * at /public/logo.svg or /public/logo.png, it will be used automatically.
 *
 * Variants:
 * - default: charcoal text on transparent bg
 * - light: cream/white text (for dark backgrounds)
 * - dark: dark text
 */
export function Logo({
  variant = "default",
  showText = true,
  size = "md",
  className,
}: LogoProps) {
  const sizes = {
    sm: { icon: "h-7 w-7", text: "text-lg", subtitle: "text-[9px]" },
    md: { icon: "h-9 w-9", text: "text-2xl", subtitle: "text-[10px]" },
    lg: { icon: "h-14 w-14", text: "text-4xl", subtitle: "text-xs" },
  };

  const textColors = {
    default: "text-foreground",
    light: "text-white",
    dark: "text-foreground",
  };

  const accentColors = {
    default: "text-accent",
    light: "text-accent",
    dark: "text-accent",
  };

  const s = sizes[size];

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="flex items-center gap-2.5">
        {/* Logo mark - decorative monogram */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full border-2",
            s.icon,
            variant === "light"
              ? "border-accent bg-accent/10"
              : "border-accent bg-accent/5"
          )}
        >
          <span
            className={cn(
              "font-serif font-bold leading-none",
              size === "sm" ? "text-base" : size === "md" ? "text-xl" : "text-3xl",
              accentColors[variant]
            )}
          >
            R
          </span>
        </div>

        {showText && (
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                "font-serif font-semibold tracking-tight",
                s.text,
                textColors[variant]
              )}
            >
              Rakib
            </span>
            <span
              className={cn(
                "font-sans uppercase tracking-[0.3em] mt-1",
                s.subtitle,
                variant === "light" ? "text-white/70" : "text-muted-foreground"
              )}
            >
              Panjabi House
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact logo - icon only, for mobile header
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border-2 border-accent bg-accent/5 h-9 w-9",
        className
      )}
    >
      <span className="font-serif font-bold text-xl text-accent leading-none">
        R
      </span>
    </div>
  );
}
