import { cn } from "@/lib/utils";
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
 * Uses the actual logo image (public/logo.jpg) — a royal crest design
 * with gold text on black background: "AL-RAKIB PUNJABI HOUSE"
 *
 * The logo is a circular crest, so we display it as a rounded image.
 * For best results, it should be placed on a dark background (header/footer).
 */
export function Logo({
  variant = "default",
  showText = false,
  size = "md",
  className,
}: LogoProps) {
  const sizes = {
    sm: { container: "h-12 w-12", text: "text-xs" },
    md: { container: "h-16 w-16 md:h-20 md:w-20", text: "text-sm" },
    lg: { container: "h-24 w-24 md:h-28 md:w-28", text: "text-base" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo image — circular crest */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full ring-2 ring-accent/30",
          s.container
        )}
      >
        <img
          src="/logo.jpg"
          alt="Al-Rakib Panjabi House Logo"
          className="h-full w-full object-cover"
          width={80}
          height={80}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif font-semibold tracking-tight",
              s.text,
              variant === "light" ? "text-white" : "text-foreground"
            )}
          >
            Al-Rakib
          </span>
          <span
            className={cn(
              "font-sans uppercase tracking-[0.2em]",
              size === "sm" ? "text-[8px]" : "text-[10px]",
              variant === "light" ? "text-accent" : "text-muted-foreground"
            )}
          >
            Panjabi House
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact logo mark — icon only, for mobile header
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/30",
        className
      )}
    >
      <img
        src="/logo.jpg"
        alt="Al-Rakib Panjabi House"
        className="h-full w-full object-cover"
        width={40}
        height={40}
      />
    </div>
  );
}
