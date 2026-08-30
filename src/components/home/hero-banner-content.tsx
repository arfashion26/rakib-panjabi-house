"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  image: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  link: string;
  buttonText: string;
  align?: "left" | "center" | "right";
}

interface HeroContent {
  image: string;
}

interface Announcement {
  text: string;
  enabled: boolean;
}

interface HomepageContent {
  hero: HeroContent;
  announcement: Announcement;
  heroSlides?: HeroSlide[];
}

// Fallback slides if admin hasn't configured any
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    image: "",
    mobileImage: "",
    title: "Premium Panjabi Collection",
    subtitle: "Timeless elegance for the modern gentleman",
    link: "/shop/panjabi-collection",
    buttonText: "Shop Now",
    align: "left",
  },
  {
    id: "default-2",
    image: "",
    mobileImage: "",
    title: "New Arrivals 2026",
    subtitle: "Fresh designs, premium fabrics",
    link: "/new-arrivals",
    buttonText: "Explore",
    align: "left",
  },
  {
    id: "default-3",
    image: "",
    mobileImage: "",
    title: "Royal Sherwani",
    subtitle: "For your special day",
    link: "/shop/sherwani",
    buttonText: "View Collection",
    align: "left",
  },
];

export function HeroBannerContent({ content, announcement }: { content: HeroContent; announcement: Announcement }) {
  // Use admin-configured slides, or fall back to defaults
  // The slides come from the homepage content's heroSlides array
  const slides: HeroSlide[] = (content as any).heroSlides?.length
    ? (content as any).heroSlides
    : DEFAULT_SLIDES;

  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-advance every 5 seconds
  React.useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  function goTo(idx: number) {
    setCurrent(idx);
  }

  function goNext() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  function goPrev() {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  if (slides.length === 0) return null;

  const alignClass =
    slides[current].align === "center"
      ? "items-center text-center"
      : slides[current].align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <section
      className="relative h-[calc(100vh-7rem)] min-h-[500px] w-full overflow-hidden bg-primary md:h-[calc(100vh-8rem)] md:min-h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background image — desktop image + mobile image */}
          {slide.image || slide.mobileImage ? (
            <>
              {/* Desktop image (hidden on mobile) */}
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="hidden h-full w-full object-cover md:block"
                />
              )}
              {/* Mobile image (hidden on desktop) — falls back to desktop image if not set */}
              <img
                src={slide.mobileImage || slide.image}
                alt={slide.title}
                className={`h-full w-full object-cover ${slide.image ? "md:hidden" : ""}`}
              />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary via-primary to-primary/80" />
          )}

          {/* Gradient overlay for text readability */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent ${
              slide.align === "right"
                ? "md:bg-gradient-to-l md:from-transparent md:via-primary/30 md:to-primary/70"
                : slide.align === "center"
                ? ""
                : "md:bg-gradient-to-r md:from-primary/70 md:via-primary/30 md:to-transparent"
            }`}
          />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className={`flex w-full max-w-7xl flex-col justify-center px-6 md:px-12 lg:px-16 ${alignClass}`}>
          <div key={current} className="max-w-xl animate-[fadeIn_0.5s_ease-out]">
            {/* Title — bold, large, minimal */}
            {slides[current].title && (
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                {slides[current].title}
              </h1>
            )}

            {/* Subtitle — very short, one line */}
            {slides[current].subtitle && (
              <p className="mt-3 text-sm font-light text-white/90 drop-shadow md:text-lg">
                {slides[current].subtitle}
              </p>
            )}

            {/* CTA button */}
            {slides[current].link && slides[current].buttonText && (
              <Link
                href={slides[current].link}
                className="mt-6 inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-semibold uppercase tracking-wide text-accent-foreground shadow-lg transition-all hover:bg-accent/90 hover:shadow-xl active:scale-95 md:h-12 md:px-8"
              >
                {slides[current].buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows (desktop) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators + Scroll down hint */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                    ? "w-8 bg-accent"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll-down animation — bottom center */}
      <button
        onClick={() => {
          // Scroll to next section smoothly
          window.scrollTo({ top: window.innerHeight - 56, behavior: "smooth" });
        }}
        aria-label="Scroll down"
        className="absolute bottom-5 right-5 z-30 hidden flex-col items-center gap-1 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
          Scroll
        </span>
        {/* Mouse icon */}
        <div className="flex h-7 w-4 items-start justify-center rounded-full border-2 border-white/50 p-1">
          <div className="h-2 w-1 animate-[scrollDot_1.5s_ease-in-out_infinite] rounded-full bg-white" />
        </div>
      </button>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
    </section>
  );
}
