"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { Container, SectionHeading } from "@/components/layout/container";

import { useLanguage } from "@/i18n/language-context";
interface InstagramContent {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  image6: string;
}

const GRADIENTS = [
  "linear-gradient(135deg, #1a1a1f, #36454f)",
  "linear-gradient(135deg, #b8860b, #8b6f47)",
  "linear-gradient(135deg, #0f5132, #556b2f)",
  "linear-gradient(135deg, #800020, #1a1a1f)",
  "linear-gradient(135deg, #d2b48c, #f5f1e8)",
  "linear-gradient(135deg, #1a237e, #0d1117)",
];

export function InstagramFeed({ content }: { content?: InstagramContent }) {
  const { t } = useLanguage();
  const images = content
    ? [content.image1, content.image2, content.image3, content.image4, content.image5, content.image6]
    : ["", "", "", "", "", ""];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <SectionHeading
          eyebrow={t("instagram.eyebrow")}
          title={t("instagram.title")}
          subtitle={t("instagram.subtitle")}
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {images.map((img, idx) => (
            <Link
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md"
              style={!img ? { background: GRADIENTS[idx % GRADIENTS.length] } : undefined}
            >
              {/* Uploaded image or placeholder */}
              {img ? (
                <img
                  src={img}
                  alt={`${t("instagram.title")} ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-3xl font-light text-white/20">RPH</span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <Instagram className="h-4 w-4" />
            {t("instagram.followUs")}
          </a>
        </div>
      </Container>
    </section>
  );
}
