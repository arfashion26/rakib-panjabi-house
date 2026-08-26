"use client";

import * as React from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/language-context";
import Link from "next/link";

export default function FAQPage() {
  const { t } = useLanguage();
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");

  const faqs = [
    {
      category: t("faq.ordersShipping"),
      items: [
        { q: t("faq.q1"), a: t("faq.a1") },
        { q: t("faq.q2"), a: t("faq.a2") },
        { q: t("faq.q3"), a: t("faq.a3") },
        { q: t("faq.q4"), a: t("faq.a4") },
      ],
    },
    {
      category: t("faq.returnsExchanges"),
      items: [
        { q: t("faq.q5"), a: t("faq.a5") },
        { q: t("faq.q6"), a: t("faq.a6") },
        { q: t("faq.q7"), a: t("faq.a7") },
        { q: t("faq.q8"), a: t("faq.a8") },
      ],
    },
    {
      category: t("faq.productsSizing"),
      items: [
        { q: t("faq.q9"), a: t("faq.a9") },
        { q: t("faq.q10"), a: t("faq.a10") },
        { q: t("faq.q11"), a: t("faq.a11") },
        { q: t("faq.q12"), a: t("faq.a12") },
      ],
    },
    {
      category: t("faq.payments"),
      items: [
        { q: t("faq.q13"), a: t("faq.a13") },
        { q: t("faq.q14"), a: t("faq.a14") },
        { q: t("faq.q15"), a: t("faq.a15") },
        { q: t("faq.q16"), a: t("faq.a16") },
      ],
    },
    {
      category: t("faq.accountPrivacy"),
      items: [
        { q: t("faq.q17"), a: t("faq.a17") },
        { q: t("faq.q18"), a: t("faq.a18") },
        { q: t("faq.q19"), a: t("faq.a19") },
      ],
    },
  ];

  const categories = [t("faq.allCategory"), ...faqs.map((f) => f.category)];

  const filteredFaqs = faqs
    .filter((f) => activeCategory === t("faq.allCategory") || f.category === activeCategory)
    .map((f) => ({
      ...f,
      items: f.items.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((f) => f.items.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <HelpCircle className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
              {t("faq.title")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {t("faq.subtitle")}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {/* Search */}
        <div className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("faq.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-3xl space-y-8">
          {filteredFaqs.map((section) => (
            <div key={section.category}>
              <h2 className="mb-4 font-serif text-xl font-medium text-accent">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${section.category}-${idx}`}
                    className="rounded-lg border border-border/60 bg-card px-4"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="py-16 text-center">
              <HelpCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium">{t("faq.noMatch")}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("faq.noMatchDesc")}
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-lg bg-muted/30 p-8 text-center">
          <h2 className="font-serif text-2xl font-medium">{t("faq.stillQuestions")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {t("faq.stillQuestionsDesc")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/contact">{t("faq.contactSupport")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/track-order">{t("faq.trackOrderLink")}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
